import { useForm } from "react-hook-form";
import type { HotelFormData } from "../types";

type HotelFormProps = {
	onSubmit: (data: HotelFormData) => void;
	initialHotel?: HotelFormData | undefined;
	onCancel: () => void;
};

function HotelForm({ onSubmit, initialHotel, onCancel }: HotelFormProps) {
	const {
		register,
		handleSubmit,
		setValue,
		setError,
		clearErrors,
		watch,
		formState: { errors },
	} = useForm<HotelFormData>({
		defaultValues: initialHotel ?? {
			name: "",
			city: "",
			rating: 0,
			date: "",
			type: "",
			memo: "",
			images: [],
		},
	});

	const images = watch("images");
	const rating = watch("rating");

	//画像圧縮
	const resizeImage = (imageData: string): Promise<string> => {
		return new Promise((resolve, reject) => {
			const img = new Image();

			img.onload = () => {
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");

				if (!ctx) {
					reject(new Error("画像を処理できませんでした"));
					return;
				}

				let width = img.width;
				let height = img.height;

				if (width > 1200) {
					height = height * (1200 / width);
					width = 1200;
				}
				canvas.width = width;
				canvas.height = height;
				ctx.drawImage(img, 0, 0, width, height);

				const resizedImage = canvas.toDataURL("image/jpeg", 0.8);
				resolve(resizedImage);
			};

			img.onerror = () => {
				reject(new Error("画像を読み込めませんでした"));
			};

			img.src = imageData;
		});
	};

	const readAndResizeImage = (file: File): Promise<string> => {
		return new Promise<string>((resolve, reject) => {
			const reader = new FileReader();

			reader.addEventListener("load", async () => {
				if (typeof reader.result !== "string") {
					reject(new Error("画像を読み込めませんでした"));
					return;
				}
				try {
					const resizedImage = await resizeImage(reader.result);
					resolve(resizedImage);
				} catch (error) {
					reject(error);
				}
			});

			reader.onerror = () => {
				reject(new Error("画像ファイルの読み込みに失敗しました"));
			};

			reader.readAsDataURL(file);
		});
	};

	return (
		<form className="hotel-form" onSubmit={handleSubmit(onSubmit)}>
			<label className="field">
				<span>ホテル名</span>
				<input
					type="text"
					placeholder="入力してください"
					{...register("name", {
						required: "ホテル名を入力してください",
					})}
				/>
				{errors.name && <p className="form-error">{errors.name.message}</p>}
			</label>

			<label className="field">
				<span>地域</span>
				<input
					type="text"
					placeholder="入力してください"
					{...register("city", {
						required: "地域を入力してください",
					})}
				/>
				{errors.city && <p className="form-error">{errors.city.message}</p>}
			</label>

			<div className="field">
				<input
					type="hidden"
					{...register("rating", {
						validate: (value) => value >= 1 || "評価を選択してください",
					})}
				/>
				<span>評価</span>
				<div className="star-rating">
					{[1, 2, 3, 4, 5].map((star) => (
						<button
							key={star}
							type="button"
							className="star-button"
							onClick={() => {
								setValue("rating", star, {
									shouldValidate: true,
								});
							}}
						>
							<svg
								width="32"
								height="32"
								viewBox="0 0 24 24"
								fill={star <= rating ? "#E8AC35" : "none"}
								stroke={star <= rating ? "#E8AC35" : "#999"}
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
							>
								<polygon points="12 2 15.1 8.3 22 9.3 17 14.2 18.2 21.1 12 17.8 5.8 21.1 7 14.2 2 9.3 8.9 8.3 12 2" />
							</svg>{" "}
						</button>
					))}
				</div>
				{errors.rating && <p className="form-error">{errors.rating.message}</p>}
			</div>

			<label className="field">
				<span>宿泊日</span>
				<input type="date" {...register("date")} />
			</label>

			<label className="field">
				<span>種類</span>

				<select {...register("type")}>
					<option value="">選択してください</option>
					<option value="シティホテル">シティホテル</option>
					<option value="旅館">旅館</option>
					<option value="リゾートホテル">リゾートホテル</option>
					<option value="ビジネスホテル">ビジネスホテル</option>
				</select>
			</label>

			<label className="field field-full">
				<span>メモ</span>

				<textarea
					rows={6}
					placeholder="空間、朝食、接客、また泊まりたい理由など"
					{...register("memo")}
				/>
			</label>

			<label className="field field-full">
				<span>写真（3枚まで登録できます）</span>

				<input
					className="file-input"
					type="file"
					accept="image/png,image/jpeg"
					multiple
					onChange={async (e) => {
						if (!e.target.files) return;

						const selectedFiles = Array.from(e.target.files);
						if (selectedFiles.length === 0) {
							return;
						}

						if (images.length + selectedFiles.length > 3) {
							setError("images", {
								type: "manual",
								message:
									"選択できる写真は3枚までです。\n追加する場合は、登録済みの画像を削除してから選択してください。",
							});

							e.target.value = "";

							return;
						}

						const imagePromises = selectedFiles.map((file) => {
							return readAndResizeImage(file);
						});

						try {
							const resizedImages = await Promise.all(imagePromises);
							setValue("images", [...images, ...resizedImages]);
							clearErrors("images");
							e.target.value = "";
						} catch (error) {
							console.error("画像の読み込みエラー:", error);
							alert("画像を読み込めませんでした。もう一度お試しください。");
							e.target.value = "";
						}
					}}
				/>
				{errors.images && <p className="form-error">{errors.images.message}</p>}
			</label>

			{images.length > 0 && (
				<div className="field-full">
					<p>現在の画像</p>
					{images.map((image, index) => (
						<div key={image}>
							<img
								src={image}
								alt="現在登録されているホテル画像"
								style={{ width: "200px" }}
							/>

							<button
								type="button"
								onClick={() => {
									const updatedImages = images.filter(
										(_, imageIndex) => imageIndex !== index,
									);

									setValue("images", updatedImages);
									clearErrors("images");
								}}
							>
								削除
							</button>
						</div>
					))}
				</div>
			)}

			<div className="form-actions field-full">
				{initialHotel && (
					<button type="button" className="secondary-button" onClick={onCancel}>
						キャンセル
					</button>
				)}

				<button type="submit" className="button">
					{initialHotel ? "更新" : "登録"}
				</button>
			</div>
		</form>
	);
}

export default HotelForm;
