<svelte:head>
	<title>What's New?</title>
</svelte:head>
<div class="block">
	<h1 class="header">What’s New?</h1>
</div>
<div class="block update">
	<h3>1 March 2023</h3>
	<ul>
		<li>Missions and Mission Packs now have a Date Added field.</li>
		<li>
			When pasting a logfile during a Solve upload, mission name and time are filled in from the logfile info.
			<ul>
				<li>
					Make sure to double check what gets filled in; the info may be wrong in rare cases if the logfile contains
					multiple missions or bombs.
				</li>
			</ul>
		</li>
		<li>When uploading a mission, a Logfile Analyzer link is now required instead of a file upload.</li>
		<li>Missions can now store a link to the logfile that defines its mission parameters.</li>
		<li>New sort option on the home page: Date Added</li>
		<li>A few minor bug fixes</li>
	</ul>
</div>
<div class="block update">
	<h3>8 February 2023</h3>
	<ul>
		<li>New page: What's New? (You're looking at it!)</li>
		<li>
			New Info tab in the top navigation bar
			<ul>
				<li>Link to Rules page</li>
				<li>Link to GitHub where you can post suggestions, issues, or even contribute to the project</li>
				<li>Link to What's New page</li>
			</ul>
		</li>
		<li>
			On a mission page, if it has a variant, click on the name of the variant to go to that variant's mission page.

			<ul>
				<li>Go check out: <a href="/mission/No-Needy%20Centurion">No-Needy Centurion</a></li>
				<li>Also: <a href="/mission/Triforce">Triforce</a></li>
				<li>Also: <a href="/mission/Fate">Fate</a></li>
			</ul>
		</li>
		<li>A few navigation bug fixes</li>
	</ul>
</div>
<div class="block update">
	<h3>24 January 2023</h3>
	<ul>
		<li>
			Users can upload TP solves. No more need to post them to the CB Site Data Errors thread. There's even a <a
				href="/user/Twitch%20Plays">Solver's page for TP</a> too! The link is in the upper left of the Solvers page.
		</li>
		<li>Mission Packs now have their own pages that list the missions in that pack.</li>
		<li>
			In a Mission's page, the pools show the percentage of that pool that's made up of each specific module
			<ul>
				<li>Go check out <a href="/mission/Invasion">Invasion</a></li>

				<li>Also <a href="/mission/%27Not%27%20Centurion">Not Centurion</a></li>
				<li>Also <a href="/mission/Irene">Irene</a></li>
			</ul>
		</li>
		<li>Mission pages have two view options: Pools and Probabilities</li>
		<li>
			Maintainers can add notes to bomb solves. These are for special circumstances, like doing Australia bomb upside
			down or doing a bomb as a Yes/No challenge, etc.
		</li>
		<li>Multi-bomb missions now have Time Mode and Strike Mode (global / local)</li>
	</ul>
</div>
<div class="block update">
	<h3>11 January 2023</h3>
	<ul>
		<li>Home page remembers your search text. There's an option to turn that off in the filter menu if you prefer.</li>
		<li>Uploading of multiple bomb missions now works.</li>
		<li>
			Uploading a mission with the same name as an existing one will replace the mission's parameters, bombs, and
			modules if accepted.
		</li>
		<li>
			Pools are easier to see and distinguish with new dashed border only on pools that have multiple modules in them.
		</li>
		<li>You can sort and filter by number of bombs on a mission.</li>
		<li>User names can now have special characters (e.g. *\"!?#, etc.)</li>
		<li>Lots of little cosmetic / QOL changes.</li>
	</ul>
</div>
<div class="block update">
	<h3>23 December 2022</h3>
	<ul>
		<li>
			Users Solver's pages have changed. Among other changes, there are now two view options: Alphabetical and By Role.
		</li>
		<li>
			If you solve a mission as a Defuser, as an Expert, and by doing EFM, that mission is listed in green on your
			solver's page.
		</li>
		<li>Unverified solves do not affect the statistics on mission cards or a user's solves stats.</li>
		<li>
			You can filter by missions that have been solved by TP separately than missions that have been solved by a team.
		</li>
		<li>Lots of little cosmetic / QOL changes.</li>
	</ul>
</div>
<div class="block update">
	<h3>7 December 2022</h3>
	<ul>
		<li>
			Proof links in the list of solves for a mission now say whether they are a logfile link, a video link, or a
			generic link.
		</li>
	</ul>
</div>
<div class="block update">
	<h3>4 December 2022</h3>
	<ul>
		<li>
			When uploading a solve, the Team and Proof textboxes are dynamically generated as you add team member names and
			proof links.
		</li>
	</ul>
</div>
<div class="block update">
	<h3>27 September 2022</h3>
	<ul>
		<li>New search option: name of people who solved the mission</li>
		<li>
			New filter options:
			<ul>
				<li>Min and max number of modules</li>
				<li>Min and max about of time given</li>
				<li>Min and max number of strikes</li>
				<li>Min and max number of widgets</li>
				<li>Whether a mission has been solved or not</li>
				<li>Whether a mission has a boss module or not</li>
				<li>Whether a mission has a semi-boss module or not</li>
				<li>Whether a mission has a pseudo-needy module or not</li>
				<li>Whether a mission has a needy module or not</li>
				<li>Upload a Defuser or Expert or Combined profile to filter missions whose modules match that profile</li>
			</ul>
		</li>
		<li>
			New sort options:
			<ul>
				<li>By mission name</li>
				<li>By number of modules</li>
				<li>By amount of time given</li>
				<li>By number of solves</li>
				<li>By percentage of rule seeded modules on the bomb</li>
			</ul>
		</li>
	</ul>
</div>
<div class="block update">
	<h3>21 September 2022</h3>
	<ul>
		<li>Added search bar to home page with options to search by mission name and author name.</li>
	</ul>
</div>

<style>
	.update {
		padding: 10px;
	}
	.update a {
		color: var(--text-color);
	}
</style>
