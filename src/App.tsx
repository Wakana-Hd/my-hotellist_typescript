import { BedDouble } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Header from "./components/Header";
import HotelCard from "./components/HotelCard";
import HotelForm from "./components/HotelForm";
import Login from "./components/Login";
import StarRating from "./components/StarRating";
import { finishPasswordRecovery, useAuth } from "./lib/auth";
import { supabase } from "./lib/supabase";
import type { Hotel, HotelFormData } from "./types";
import "./App.css";

function App() {
	const [hotelList, setHotelList] = useState<Hotel[]>([]);

	const [editingHotelId, setEditingHotelId] = useState<number | null>(null);
	const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);
	const [screen, setScreen] = useState("list");
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const imageContainerRef = useRef<HTMLDivElement | null>(null);
	const { session, loading, isPasswordRecovery } = useAuth();

	useEffect(() => {
		let cancelled = false;

		if (!session) {
			setHotelList([]);
			return;
		}

		const fetchHotels = async () => {
			const { data, error } = await supabase
				.from("hotels")
				.select("*")
				.order("id", { ascending: true });

			if (error) {
				console.error("ホテルデータの取得に失敗しました:", error);
				return;
			}

			if (!cancelled) {
				setHotelList(
					(data ?? []).map((hotel) => ({
						...hotel,
						images: hotel.images ?? [],
						date: hotel.date ?? "",
						type: hotel.type ?? "",
						memo: hotel.memo ?? "",
					})),
				);
			}
		};

		fetchHotels();

		return () => {
			cancelled = true;
		};
	}, [session]);

	//登録、編集
	const handleAddHotel = async (data: HotelFormData) => {
		if (!session) {
			alert("ログインが必要です");
			return;
		}

		let success = false;

		if (editingHotelId !== null) {
			const updatedHotels = hotelList.map((hotel) => {
				if (hotel.id === editingHotelId) {
					return {
						//編集前のホテル情報
						...hotel,
						//新しい情報で上書き
						...data,
					};
				}
				return hotel;
			});

			const { error } = await supabase
				.from("hotels")
				.update({
					...data,
					rating: data.rating,
					date: data.date || null,
				})
				.eq("id", editingHotelId);

			if (error) {
				console.error("ホテルの編集に失敗しました:", error);
				alert("ホテルの編集に失敗しました");
				return;
			}

			setHotelList(updatedHotels);
			success = true;
		} else {
			const { data: newHotels, error } = await supabase
				.from("hotels")
				.insert({
					...data,
					rating: data.rating,
					date: data.date || null,
					user_id: session.user.id,
				})
				.select();

			if (error) {
				console.error("ホテルの登録に失敗しました:", error);
				alert("ホテルの登録に失敗しました");
				return;
			}

			setHotelList([
				...hotelList,
				...newHotels.map((hotel) => ({
					...hotel,
					images: hotel.images ?? [],
					date: hotel.date ?? "",
					type: hotel.type ?? "",
					memo: hotel.memo ?? "",
				})),
			]);
			success = true;
		}

		if (success) {
			setEditingHotelId(null);
			setScreen("list");
		}
	};

	//削除
	const handleDeleteHotel = async (id: number) => {
		const { error } = await supabase.from("hotels").delete().eq("id", id);

		if (error) {
			console.error("ホテルの削除に失敗しました:", error);
			alert("ホテルの削除に失敗しました");
			return;
		}

		setHotelList(hotelList.filter((hotel) => hotel.id !== id));
		const success = true;

		if (success) {
			setSelectedHotelId(null);
			setScreen("list");
		}
	};

	//編集
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

		const imageCount = selectedHotel.images?.length;

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
			alert("ログアウトに失敗しました。もう一度お試しください。");
			console.error("ログアウトエラー:", error);
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
							{selectedHotel.images.length > 0 ? (
								selectedHotel.images.map((image, index) => (
									<img
										key={image}
										className="detail-image"
										src={image}
										alt={`${selectedHotel.name} ${index + 1}`}
									/>
								))
							) : (
								<div className="detail-image no-image">
									<BedDouble size={48} />
									<span>No Image</span>
								</div>
							)}
						</div>

						<div className="image-dots">
							{selectedHotel.images.map((image, index) => (
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

						<div className="detail-rating">
							<StarRating rating={selectedHotel.rating} />
						</div>
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
						key={editingHotelId ?? "new"}
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
			{!session || isPasswordRecovery ? (
				<Login
					isPasswordRecovery={isPasswordRecovery}
					onPasswordUpdated={finishPasswordRecovery}
				/>
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
