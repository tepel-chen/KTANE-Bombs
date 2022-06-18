import client from '$lib/client';
import { getData } from '$lib/repo';
import { Completion, Mission, Permission, type ID, type MissionPack } from '$lib/types';
import { forbidden, hasPermission } from '$lib/util';
import type { RequestHandlerOutput, RequestEvent } from '@sveltejs/kit';

export async function get({ params, locals }: RequestEvent): Promise<RequestHandlerOutput> {
	if (!hasPermission(locals.user, Permission.VerifyMission)) {
		return forbidden(locals);
	}

	const { mission } = params;
	const missionResult = await client.mission.findFirst({
		where: {
			name: mission
		},
		select: {
			id: true,
			name: true,
			verified: true,
			bombs: true,
			completions: {
				where: {
					verified: true
				}
			},
			tpSolve: true,
			factory: true,
			variant: true,
			missionPack: {
				select: {
					name: true,
					author: true,
					steamId: true
				}
			}
		}
	});

	if (missionResult === null) {
		return {
			status: 404
		};
	}

	const packs = await client.missionPack.findMany({
		select: {
			name: true
		}
	});

	if (!missionResult.verified && !hasPermission(locals.user, Permission.VerifyMission)) {
		return forbidden(locals);
	}

	return {
		body: {
			mission: missionResult,
			packs,
			modules: await getData()
		}
	};
}

export async function post({ locals, request }: RequestEvent): Promise<RequestHandlerOutput> {
	if (!hasPermission(locals.user, Permission.VerifyMission)) {
		return forbidden(locals);
	}

	const mission: Omit<ID<Mission>, 'completions'> & {
		completions: ID<Completion>[];
		missionPack: Pick<ID<MissionPack>, 'id' | 'name'>;
	} = await request.json();

	await client.mission.update({
		where: {
			id: mission.id
		},
		data: {
			completions: {
				updateMany: mission.completions.map((completion) => ({
					where: {
						id: completion.id
					},
					data: completion
				}))
			},
			factory: mission.factory,
			missionPackId: mission.missionPack.id,
			name: mission.name,
			tpSolve: mission.tpSolve
		}
	});

	return {
		status: 200
	};
}
