export type Hotel = {
	id: number;
	name: string;
	city: string;
	rating: number;
	images: string[];
	date: string;
	type: string;
	memo: string;
};

export type HotelFormData = {
	name: string;
	city: string;
	rating: number;
	date: string;
	type: string;
	memo: string;
	images: string[];
};
