import { useForm } from "react-hook-form";

type HotelFormData = {
	name: string;
	city: string;
	rating: string;
	date: string;
	type: string;
	memo: string;
	images: string[];
};

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
		watch,
		formState: { errors },
	} = useForm<HotelFormData>({
		defaultValues: initialHotel ?? {
			name: "",
			city: "",
			rating: "",
			date: "",
			type: "",
			memo: "",
			images: [],
		},
	});

	const images = watch("images");

	//画像圧縮
	const resizeImage = (imageData: string): Promise<string> => {
		return new Promise((resolve) => {
			const img = new Image();

			img.onload = () => {
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");

				if (!ctx) {
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

			img.src = imageData;
		});
	};

	const readAndResizeImage = (file: File): Promise<string> => {
		return new Promise<string>((resolve) => {
			const reader = new FileReader();

			reader.addEventListener("load", async () => {
				if (typeof reader.result !== "string") {
					return;
				}
				const resizedImage = await resizeImage(reader.result);
				resolve(resizedImage);
			});

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
				{errors.name && <p>{errors.name.message}</p>}
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
				{errors.city && <p>{errors.city.message}</p>}
			</label>

			<label className="field">
				<span>評価</span>
				<select
					{...register("rating", {
						required: "評価を選択してください",
					})}
				>
					<option value="">選択してください</option>
					<option value="★★★★★">★★★★★</option>
					<option value="★★★★☆">★★★★☆</option>
					<option value="★★★☆☆">★★★☆☆</option>
					<option value="★★☆☆☆">★★☆☆☆</option>
					<option value="★☆☆☆☆">★☆☆☆☆</option>
				</select>
				{errors.rating && <p>{errors.rating.message}</p>}
			</label>

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
							alert("選択できる写真は3枚までです");
							return;
						}
						const imagePromises = selectedFiles.map((file) => {
							return readAndResizeImage(file);
						});

						const resizedImages = await Promise.all(imagePromises);

						setValue("images", [...images, ...resizedImages]);
					}}
				/>
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
