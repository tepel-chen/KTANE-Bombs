<script lang="ts">
	import Input from '$lib/controls/Input.svelte';
	import Select from '$lib/controls/Select.svelte';
	import MissionCard from '$lib/cards/MissionCard.svelte';
	import { Bomb, Pool, type MissionPackSelection } from '$lib/types';
	import { getLogfileLinks, reservedSearchStrings, validateLogfileLink } from '$lib/util';
	import toast from 'svelte-french-toast';
	import Checkbox from '$lib/controls/Checkbox.svelte';
	import type { ReplaceableMission } from './_types';

	export let missionNames: string[];
	export let authorNames: string[];
	export let packs: MissionPackSelection[];

	let invalid = false;
	let logfileLink = '';
	let parsedLogfileLink = '';
	let missions: ReplaceableMission[] = [];
	let selectedMissions: Record<number, boolean> = {};
	let missionNameQuirk: number[] = [];
	const EXISTS = 1;
	const RESERVED = 2;

	async function readLogfile() {
		if (invalid) return;
		let links = getLogfileLinks(logfileLink);
		parsedLogfileLink = links[1];
		fetch(links[0])
			.then(v => v.text())
			.then(f => (missions = parseMissions(f)));
	}

	function parseMissions(text: string) {
		let missions: ReplaceableMission[] = [];
		let mission: ReplaceableMission | null = null;
		let bomb: Bomb | null = null;
		let lineIndex = 0;
		const lines = text.split('\n');

		function readLine() {
			return lines[lineIndex++];
		}

		while (lineIndex < lines.length) {
			let line = readLine().trim();
			if (line === '[State] Enter GameplayState') {
				mission = {
					completions: [],
					bombs: [],
					name: '',
					authors: [],
					designedForTP: false,
					tpSolve: false,
					factory: null,
					timeMode: null,
					strikeMode: null,
					missionPack: null,
					replace: false,
					dateAdded: new Date(),
					logfile: parsedLogfileLink
				};

				missions = [...missions, mission];
				missionNameQuirk.push(0);
			} else if (line.startsWith('[BombGenerator] Generator settings: ') && mission !== null) {
				let match = line.match(/Time: (\d+), NumStrikes: (\d+)/);
				if (match === null) throw new Error('This regex should always match');

				bomb = new Bomb();
				bomb.time = parseInt(match[1]);
				bomb.strikes = parseInt(match[2]);
				bomb.pools = [];
				bomb.widgets = -1;
				bomb.modules = 0;

				match = readLine().match(/(\d+) Pools:/);
				if (match === null) throw new Error('This regex should always match');
				let pools = parseInt(match[1]);
				for (let i = 0; i < pools; i++) {
					match = readLine().match(/\[(.+)\] Count: (\d+)(?:, Sources: (.+))?/);
					if (match === null) throw new Error('This regex should always match');
					const count = parseInt(match[2]);

					const modules = match[1].split(', ');
					if (!modules[0].toLowerCase().startsWith('multiple bombs')) {
						// If the sources are listed, update the "module" to include the source.
						const sources = match[3]?.split(', ');
						if (sources !== undefined && sources.length === 1) {
							const source = sources[0] == 'Modded' ? 'MODS' : 'VANILLA';
							modules[0] = `ALL_${source}_${modules[0].substring(4)}`;
						}

						bomb.pools.push(new Pool(modules, count));
						bomb.modules += count;
					}
				}

				mission.bombs.push(bomb);
				if (mission.bombs.length > 1) {
					if (mission.factory === null) mission.factory = 'Sequence';
					mission.timeMode = 'Local';
					mission.strikeMode = 'Local';
				}
			} else if (line.startsWith('[WidgetGenerator] Added widget: ') && bomb !== null) {
				bomb.widgets++;
			} else if (line.startsWith('[Tweaks] LFAEvent ') && mission !== null) {
				const match = line.match(/LFAEvent (\d+)/);
				if (match === null) throw new Error('This regex should always match');

				let json = '';
				for (let i = 0; i < parseInt(match[1]); i++) {
					json += readLine();
				}

				const event = JSON.parse(json);
				if (event.type === 'ROUND_START') {
					mission.name = event.mission;
					if (reservedSearchStrings.some(str => mission?.name.includes(str))) {
						missionNameQuirk[missionNameQuirk.length - 1] = RESERVED;
					} else if (missionNames.some(n => n.toLowerCase() == mission?.name.toLowerCase())) {
						missionNameQuirk[missionNameQuirk.length - 1] = EXISTS;
						mission.replace = true;
					}
				}
			} else if (line.startsWith('[Factory] Creating gamemode') && mission !== null) {
				const match = line.match(/Creating gamemode '(.+)'\./);
				if (match === null) throw new Error('This regex should always match');

				mission.factory = match[1].replace('Finite', 'Sequence');
			}
		}

		missions.forEach(m => {
			if (m.bombs.length < 2) m.factory = null;
		});

		return missions;
	}

	function sendMissions() {
		fetch('/upload/missions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(missions.filter((_, index) => selectedMissions[index]))
		})
			.then(response => {
				const plural = Object.values(selectedMissions).filter(value => value).length > 1;
				const word = `Mission${plural ? 's' : ''}`;
				if (response.ok) {
					toast.success(`${word} uploaded successfully!`);
				} else {
					toast.error(`${word} failed to upload.`);
				}
			})
			.catch(() => toast.error('An error occurred.'));
	}
</script>

<div class="block flex column">
	<div>Select a logfile that contains the mission to upload.</div>
	<Input
		label="Logfile link:"
		id="logfile-link"
		bind:invalid
		bind:value={logfileLink}
		required
		validate={validateLogfileLink} />
	<div><button disabled={invalid} on:click={readLogfile}>Get Mission Info</button></div>
</div>
{#if missions.length !== 0}
	<div class="block">Select one or more missions from the logfile.</div>
	<form on:submit|preventDefault={sendMissions}>
		<div class="missions flex column">
			{#each missions as mission, i (mission)}
				<div class="flex">
					<div class="flex column mission-holder">
						<MissionCard {mission} selectable id={'missioncard' + i} bind:selected={selectedMissions[i]} />
						{#if missionNameQuirk[i] > 0}
							{#if missionNameQuirk[i] == EXISTS}
								<span class="block info">
									<b>
										This mission name already exists. Selecting this would replace the existing mission if accepted.
									</b>
								</span>
							{:else if missionNameQuirk[i] == RESERVED}
								<span class="block error">
									<b>Mission name may not contain any of these strings exactly:</b>
									{#each reservedSearchStrings as str, index}
										<b>{str}</b>{index < reservedSearchStrings.length - 1 ? ', ' : ''}
									{/each}
								</span>
							{/if}
						{/if}
					</div>
					<div class="block params">
						<Input
							name="Authors"
							label="Authors"
							id="mission-authors-{i}"
							options={authorNames}
							optionalOptions={true}
							bind:value={mission.authors} />
						<Input
							name="Mission Pack"
							label="Mission Pack"
							id="mission-pack-{i}"
							bind:value={mission.missionPack}
							options={packs}
							display={pack => (pack === null ? '' : pack.name)}
							validate={pack => pack !== null}
							instantFormat={false}
							required={selectedMissions[i]} />
						{#if mission.bombs.length > 1}
							<div class="flex grow hspace">
								<Select
									label="Factory"
									id="mission-factory-{i}"
									bind:value={mission.factory}
									options={['Static', 'Sequence']} />
								<Select
									label="Time Mode"
									id="mission-timemode-{i}"
									bind:value={mission.timeMode}
									options={['Local', 'Global']} />
								<Select
									label="Strike Mode"
									id="mission-strikemode-{i}"
									bind:value={mission.strikeMode}
									options={['Local', 'Global']} />
							</div>
						{/if}
						<Checkbox
							id="designed-for-tp-{i}"
							label="Designed for TP"
							bind:checked={mission.designedForTP}
							sideLabel
							labelAfter />
					</div>
				</div>
			{/each}
		</div>
		{#if Object.values(selectedMissions).some(a => a) && Object.values(selectedMissions).every((e, i) => !(e && missionNameQuirk[i] >= RESERVED))}
			<div class="block">
				<button type="submit"
					>Upload Mission{Object.values(selectedMissions).filter(a => a).length == 1 ? '' : 's'}</button>
			</div>
		{/if}
	</form>
{/if}

<style>
	.mission-holder {
		width: 74%;
	}
	.error {
		color: red;
	}
	.flex.hspace {
		gap: 10px;
	}
	.block.params {
		width: 26%;
	}
</style>
