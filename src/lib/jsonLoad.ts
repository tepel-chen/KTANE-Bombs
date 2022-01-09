import type { Load, LoadInput } from '@sveltejs/kit';

export function jsonLoadStatic(urls: Record<string, string>): Load {
	return jsonLoad(() => urls);
}

export function jsonLoad(urls: (input: LoadInput) => Record<string, string>): Load {
	const load: Load = async function (input) {
		const { fetch } = input;

		const props = {};
		for (const [prop, url] of Object.entries(urls(input))) {
			const request = await fetch(`/${url}.json`);
			const json = await request.json();

			if (!request.ok) {
				return {
					status: request.status
				};
			}

			props[prop] = json;
		}

		return {
			props
		};
	};

	return load;
}
