export const fetchApi = async <T,>(endpoint: string, method: 'POST' | 'GET' | 'DELETE' | 'PUT' = 'GET', body?: BodyInit): Promise<T> => {
	return new Promise((resolve, reject) => {
		if (endpoint) {
			const URL = `${process.env.REACT_APP_BACKEND_URL + endpoint}`; //localhost:8080 + /users/1

			const settings: RequestInit = {
				method,
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: body,
			};

			try {
				fetch(URL, settings).then((response) => resolve(response.json()));
			} catch (error) {
				reject('fetch error:' + error);
			}
		} else {
			reject('No endpoint defined');
		}
	});
};
