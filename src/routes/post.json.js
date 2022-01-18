// .json.js files create and endpoint - in this case, /post which returns JSON

// get() maps to GET request
export async function get({ params }) {
	return {
		status: 200,
		body: {
			message: 'Hello',
			params,
		},
	};
}
