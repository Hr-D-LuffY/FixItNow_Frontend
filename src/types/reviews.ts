export type Review = {
	id: string;
	bookingId: string;
	rating: number;
	comment: string;
	createdAt: string;
};

export type CreateReviewInput = {
	bookingId: string;
	rating: number;
	comment: string;
};

export type ReviewResponseData = {
	review: Review;
};
