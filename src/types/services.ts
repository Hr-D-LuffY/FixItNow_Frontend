import type { Paginated } from "@/lib/api";

export type Technician = {
	id: string;
	userId: string;
	bio: string | null;
	skills: string[];
	experienceYears: number | null;
	availability: boolean;
	user?: {
		id: string;
		name: string;
	};
};

export type Category = {
	id: string;
	name: string;
	description: string | null;
};

export type Service = {
	id: string;
	title: string;
	description: string;
	price: number;
	categoryId: string;
	category: Category;
	technician: Technician;
	imageUrl?: string | null;
	createdAt: string;
	updatedAt: string;
};

export type ServiceDetailData = {
	service: Service;
};

export type ServicesListData = Paginated<Service, "services">;

// Assumed unpaginated — confirm against a real /categories response
export type CategoriesListData = {
	categories: Category[];
};
