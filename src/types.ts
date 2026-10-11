export type Hotel = {
	id: number;
	name: string;
	city: string;
	rating: string;
	images: string[];
	image?: string;
	date: string;
	type: string;
	memo: string;
};

export type HotelFormData = {
	name: string;
	city: string;
	rating: string;
	date: string;
	type: string;
	memo: string;
	images: string[];
};
