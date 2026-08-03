export type TechnicianProfile = {
	id: string;
	userId: string;
	bio: string | null;
	skills: string[];
	experienceYears: number | null;
	availability: boolean;
	createdAt: string;
	updatedAt: string;
};

export type SaveTechnicianProfileInput = {
	bio?: string;
	skills: string[];
	experienceYears?: number;
	availability: boolean;
};

export type TechnicianProfileResponseData = {
	profile: TechnicianProfile;
};
