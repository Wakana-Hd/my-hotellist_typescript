import "./App.css";
import { useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import HotelCard from "./components/HotelCard";
import HotelForm from "./components/HotelForm";
import Login from "./components/Login";
import { useAuth } from "./lib/auth";
import { supabase } from "./lib/supabase";

type Hotel = {
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
type HotelFormData = {
	name: string;
	city: string;
	rating: string;
	date: string;
	type: string;
	memo: string;
	images: string[];
};

function App() {
	//開いたとき、localStorageに保存済みホテルがあれば配列に戻してhotelListの初期値にする。
	//何も保存されていなければ空配列 [] から始める。
	const [hotelList, setHotelList] = useState<Hotel[]>(() => {
		const savedHotels = localStorage.getItem("hotelList");

		if (savedHotels) {
			return JSON.parse(savedHotels);
		}

		return [];
	});

	const [editingHotelId, setEditingHotelId] = useState<number | null>(null);
	const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);
	const [screen, setScreen] = useState("list");
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const imageContainerRef = useRef<HTMLDivElement | null>(null);
	const { session, loading } = useAuth();

	const saveHotels = (hotels: Hotel[]) => {
		setHotelList(hotels);
		localStorage.setItem("hotelList", JSON.stringify(hotels));
	};

	//登録、編集
	const handleAddHotel = (data: HotelFormData) => {
		console.log("フォームのデータ:", data);

		const newHotel = {
			id: Date.now(),
			name: data.name,
			city: data.city,
			rating: data.rating,
			images: data.images,
			date: data.date,
			type: data.type,
			memo: data.memo,
		};
		if (editingHotelId !== null) {
			const updatedHotels = hotelList.map((hotel) => {
				if (hotel.id === editingHotelId) {
					return {
						...hotel,
						name: data.name,
						city: data.city,
						rating: data.rating,
						images: data.images,
						date: data.date,
						type: data.type,
						memo: data.memo,
					};
				}
				return hotel;
			});

			saveHotels(updatedHotels);
		} else {
			saveHotels([...hotelList, newHotel]);
		}

		setEditingHotelId(null);
		setScreen("list");
	};

	//削除する時
	const handleDeleteHotel = (id: number) => {
		saveHotels(hotelList.filter((hotel) => hotel.id !== id));

		setSelectedHotelId(null);
		setScreen("list");
	};

	//編集する時
	const handleEditHotel = (hotel: Hotel) => {
		setEditingHotelId(hotel.id);

		setScreen("form");
	};

	//キャンセル
	const handleCancelEdit = () => {
		setEditingHotelId(null);
		setScreen("detail");
	};

	const selectedHotel = hotelList.find((hotel) => hotel.id === selectedHotelId);

	useEffect(() => {
		if (!selectedHotel) return;

		const imageCount =
			selectedHotel.images?.length ?? (selectedHotel.image ? 1 : 0);

		if (imageCount <= 1) return;

		const intervalId = setInterval(() => {
			setCurrentImageIndex((currentIndex) => {
				const nextIndex = (currentIndex + 1) % imageCount;

				imageContainerRef.current?.scrollTo({
					left: imageContainerRef.current.clientWidth * nextIndex,
					behavior: "smooth",
				});

				return nextIndex;
			});
		}, 5000);

		return () => {
			clearInterval(intervalId);
		};
	}, [selectedHotel]);

	const handleSelectHotel = (id: number) => {
		setSelectedHotelId(id);
		setCurrentImageIndex(0);
		setScreen("detail");
	};

	const handleLogout = async () => {
		const { error } = await supabase.auth.signOut();

		if (error) {
			console.log("ログアウトエラー:", error);
		}
	};

	let content: React.ReactNode;

	//詳細画面
	if (screen === "detail" && selectedHotel) {
		content = (
			<main className="container detail-page">
				<button
					type="button"
					className="back-link"
					onClick={() => {
						setSelectedHotelId(null);
						setScreen("list");
					}}
				>
					← 一覧に戻る
				</button>

				<div className="hotel-detail">
					<div className="detail-gallery">
						<div
							className="detail-images"
							ref={imageContainerRef}
							onScroll={(e) => {
								const scrollLeft = e.currentTarget.scrollLeft;
								const imageWidth = e.currentTarget.clientWidth;
								const index = Math.round(scrollLeft / imageWidth);

								setCurrentImageIndex(index);
							}}
						>
							{(
								selectedHotel.images ??
								(selectedHotel.image ? [selectedHotel.image] : [])
							).map((image, index) => (
								<img
									key={image}
									className="detail-image"
									src={image}
									alt={`${selectedHotel.name} ${index + 1}`}
								/>
							))}
						</div>

						<div className="image-dots">
							{(
								selectedHotel.images ??
								(selectedHotel.image ? [selectedHotel.image] : [])
							).map((image, index) => (
								<span
									key={image}
									className={index === currentImageIndex ? "active" : ""}
								>
									●
								</span>
							))}
						</div>
					</div>

					<div className="detail-content">
						<h1>{selectedHotel.name}</h1>

						<p className="detail-rating">{selectedHotel.rating}</p>
						<dl className="detail-info">
							<div>
								<dt>地域</dt>
								<dd>{selectedHotel.city}</dd>
							</div>

							<div>
								<dt>宿泊日</dt>
								<dd>{selectedHotel.date}</dd>
							</div>

							<div>
								<dt>種類</dt>
								<dd>{selectedHotel.type}</dd>
							</div>
						</dl>

						{selectedHotel.memo && (
							<p className="detail-memo">{selectedHotel.memo}</p>
						)}

						<div className="detail-actions">
							<button
								type="button"
								className="secondary-button"
								onClick={() => handleEditHotel(selectedHotel)}
							>
								編集
							</button>

							<button
								type="button"
								className="delete-button"
								onClick={() => handleDeleteHotel(selectedHotel.id)}
							>
								削除
							</button>
						</div>
					</div>
				</div>
			</main>
		);
	}

	//登録、編集画面
	if (screen === "form") {
		content = (
			<main className="container form-page">
				<button
					type="button"
					className="back-link"
					onClick={() => {
						if (editingHotelId !== null) {
							setScreen("detail");
						} else {
							setScreen("list");
						}
					}}
				>
					{editingHotelId !== null ? "← 詳細に戻る" : "← 一覧に戻る"}
				</button>

				<div className="form-layout">
					<div className="form-intro">
						<h1>
							{editingHotelId !== null
								? "ホテルを編集する"
								: "ホテルを登録する"}
						</h1>
						<p className="form-intro-note">宿泊したホテルの記録を残します。</p>
					</div>

					<HotelForm
						onSubmit={handleAddHotel}
						initialHotel={hotelList.find(
							(hotel) => hotel.id === editingHotelId,
						)}
						onCancel={handleCancelEdit}
					/>
				</div>
			</main>
		);
	}

	//一覧画面
	if (screen === "list") {
		content = (
			<main className="container list-page">
				<div className="page-heading">
					<div>
						<h1>MY HOTEL LOG</h1>
						<p className="lead">旅の記憶と、また泊まりたい場所を残す。</p>
					</div>

					<button
						type="button"
						className="button heading-button"
						onClick={() => {
							setEditingHotelId(null);
							setScreen("form");
						}}
					>
						新しいホテルを登録する
					</button>
				</div>

				<div className="hotel-grid">
					{hotelList.map((hotel) => (
						<HotelCard
							key={hotel.id}
							hotel={hotel}
							onSelect={handleSelectHotel}
						/>
					))}
				</div>
			</main>
		);
	}

	if (loading) {
		return null;
	}
	return (
		<>
			{!session ? (
				<Login />
			) : (
				<>
					<Header
						onHome={() => setScreen("list")}
						onAdd={() => {
							setEditingHotelId(null);
							setScreen("form");
						}}
						onLogout={handleLogout}
					/>

					{content}
				</>
			)}
		</>
	);
}

export default App;
