import client from '$lib/client';
import { Permission } from '$lib/types';
import { hasPermission } from '$lib/util';
import type { EndpointOutput, RequestEvent } from '@sveltejs/kit';

export async function get({ params, locals }: RequestEvent): Promise<EndpointOutput> {
	const { mission } = params;
	const missionResult = await client.mission.findFirst({
		where: {
			name: mission
		},
		select: {
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

	const variantId = missionResult.variant;
	const variants =
		variantId == null
			? null
			: await client.mission.findMany({
					where: {
						variant: variantId,
						name: { not: missionResult.name }
					},
					select: {
						name: true,
						completions: {
							where: {
								verified: true
							}
						},
						tpSolve: true
					}
			  });

	if (!missionResult.verified && !hasPermission(locals.user, Permission.VerifyMission)) {
		return {
			status: 403
		};
	}

	return {
		body: {
			mission: missionResult,
			variants
		}
	};
}
