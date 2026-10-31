type StarRatingProps = {
	rating: number;
};

function StarRating({ rating }: StarRatingProps) {
	return (
		<div className="star-rating">
			{[1, 2, 3, 4, 5].map((star) => (
				<svg
					key={star}
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill={star <= rating ? "#E8AC35" : "none"}
					stroke={star <= rating ? "#E8AC35" : "#999"}
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
				>
					<polygon points="12 2 15.1 8.3 22 9.3 17 14.2 18.2 21.1 12 17.8 5.8 21.1 7 14.2 2 9.3 8.9 8.3 12 2" />
				</svg>
			))}
		</div>
	);
}

export default StarRating;
