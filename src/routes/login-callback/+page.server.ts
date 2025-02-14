import client from '$lib/client';
import OAuth, { scope } from '$lib/oauth';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/index.js';
import type { Cookies } from '@sveltejs/kit';
import type { TokenRequestResult } from 'discord-oauth2';
import { redirect, error } from '@sveltejs/kit';

export const load = async function load({ url, cookies }: any) {
	const code = url.searchParams.get('code');
	if (code === null) throw error(406);

	const result = await OAuth.tokenRequest({
		code,
		grantType: 'authorization_code',
		scope: scope
	});

	return await login(result, cookies);
};

export const actions = {
	selectUsername: async ({ request, cookies }: any) => {
		const fData = await request.formData();
		const username = JSON.parse(fData.get('username'));
		const result = JSON.parse(fData.get('result'));
		return await login(<TokenRequestResult>result, cookies, username);
	}
};

async function login(result: TokenRequestResult, cookies: Cookies, username: string | null = null) {
	try {
		const user = await OAuth.getUser(result.access_token);

		if (username == null) {
			const findUser = await client.user.findUnique({ where: { id: user.id } });
			if (!findUser) {
				const users = await client.user.findMany({ select: { username: true } });
				return {
					username: user.username,
					firstTime: true,
					takenUsernames: users.map(user => user.username),
					result: result
				};
			}
			username = findUser.username;
		}
		await client.user.upsert({
			where: {
				id: user.id
			},
			create: {
				id: user.id,
				username: username ?? user.username,
				discordName: `${user.username}#${user.discriminator}`,
				accessToken: result.access_token,
				refreshToken: result.refresh_token,
				avatar: user.avatar ?? `${parseInt(user.discriminator) % 5}`
			},
			update: {
				username: username ?? user.username,
				discordName: `${user.username}#${user.discriminator}`,
				accessToken: result.access_token,
				refreshToken: result.refresh_token,
				avatar: user.avatar ?? `${parseInt(user.discriminator) % 5}`
			}
		});
	} catch (e) {
		if (!(e instanceof PrismaClientKnownRequestError && e.code === 'P2002')) {
			throw e;
		}
		// Conflict happened on username, the user needs to pick another.
		const user = await OAuth.getUser(result.access_token);
		const users = await client.user.findMany({ select: { username: true } });
		return {
			username: username,
			firstTime: false,
			takenUsernames: users.map(user => user.username),
			result: result
		};
	}
	cookies.set('token', result.access_token, {
		secure: true,
		httpOnly: true,
		maxAge: 2629800
	});
	throw redirect(302, '/');
}
