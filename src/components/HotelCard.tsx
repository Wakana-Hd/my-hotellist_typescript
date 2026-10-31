import { BedDouble, MapPin } from "lucide-react";
import type { Hotel } from "../types";
import StarRating from "./StarRating";

type HotelCardProps = {
	hotel: Hotel;
	onSelect: (id: number) => void;
};

function HotelCard(props: HotelCardProps) {
	return (
		<article className="hotel-card">
			<button
				type="button"
				onClick={() => props.onSelect(props.hotel.id)}
				style={{
					border: "none",
					padding: 0,
					background: "none",
					width: "100%",
					textAlign: "left",
				}}
			>
				{props.hotel.images?.[0] ? (
					<img
						className="card-image"
						src={props.hotel.images[0]}
						alt={props.hotel.name}
					/>
				) : (
					<div className="card-image no-image">
						<BedDouble size={48} />
						<span>No Image</span>
					</div>
				)}

				<div className="card-body">
					<p className="card-location">
						<MapPin size={14} />
						{props.hotel.city}
					</p>
					<h2>{props.hotel.name}</h2>
					<StarRating rating={props.hotel.rating} />
					<p className="card-date">{props.hotel.date}</p>
				</div>
			</button>
		</article>
	);
}

export default HotelCard;
