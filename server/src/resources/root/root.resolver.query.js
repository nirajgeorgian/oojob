const RootQuery = {
	Result: {
		__resolveType(obj) {
			if (obj.username) {
				return 'User';
			}
			return null;
		},
	},
	Query: {
		test: () => 'Hello World',
	},
};

export default RootQuery;