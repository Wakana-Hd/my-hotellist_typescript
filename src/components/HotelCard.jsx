function HotelCard(props) {
    return (
        <article className="hotel-card">
            <button
                onClick={() => props.onSelect(props.hotel.id)}
                style={{
                    border: "none",
                    padding: 0,
                    background: "none",
                    width: "100%",
                    textAlign: "left",
                }}
            >
                <img className="card-image"
                    src={props.hotel.images?.[0] ?? props.hotel.image}
                    alt={props.hotel.name} />
                    
                <div className="card-body">
                    <p className="card-location">{props.hotel.city}</p>
                    <h2>{props.hotel.name}</h2>
                    <p className="rating">{props.hotel.rating}</p>
                    <p className="card-date">{props.hotel.date}</p>
                </div>
            </button>
        </article>
    );
}

export default HotelCard;