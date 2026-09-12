import "./App.css";
import HotelCard from "./components/HotelCard";
import { useState, useEffect, useRef } from "react";
import Header from "./components/Header";


function App() {
  //開いたとき、localStorageに保存済みホテルがあれば配列に戻してhotelListの初期値にする。
  //何も保存されていなければ空配列 [] から始める。
  const [hotelList, setHotelList] = useState(() => {
    const savedHotels = localStorage.getItem("hotelList");

    if (savedHotels) { return JSON.parse(savedHotels); }
    return [];
  });
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [rating, setRating] = useState("");
  const [images, setImages] = useState([]);
  const [date, setDate] = useState("");
  const [type, setType] = useState("");
  const [memo, setMemo] = useState("");
  //今編集しているホテルのidを保存する
  const [editingHotelId, setEditingHotelId] = useState(null);
  //今詳細画面で表示しているホテルのidを保存する
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [screen, setScreen] = useState("list");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageContainerRef = useRef(null);

  //登録ボタンを押した時
  const handleAddHotel = () => {
    const errors = [];

    if (name === "") {
      errors.push("ホテル名")
    }
    if (city === "") {
      errors.push("地域")
    }
    if (rating === "") {
      errors.push("評価")
    }
    if (errors.length > 0) {
      alert(`${errors.join("・")}を入力してください`);
      return; /*ここで処理を終了する→登録しない*/
    }

    const newHotel = {
      id: Date.now(),
      name: name,
      city: city,
      rating: rating,
      images: images,
      date: date,
      type: type,
      memo: memo,
    };
    if (editingHotelId !== null) {
      const updatedHotels = hotelList.map((hotel) => {
        if (hotel.id === editingHotelId) {
          return {
            ...hotel,
            name: name,
            city: city,
            rating: rating,
            images: images,
            date: date,
            type: type,
            memo: memo,
          };
        }
        return hotel;
      });

      setHotelList(updatedHotels);
    } else {
      setHotelList([
        ...hotelList,
        newHotel,
      ]);
    }
    setName("");
    setCity("");
    setRating("");
    setImages([]);
    setDate("");
    setType("");
    setMemo("");

    setEditingHotelId(null);
    setScreen("list");
  };

  //削除する時
  const handleDeleteHotel = (id) => {
    setHotelList(
      hotelList.filter((hotel) => hotel.id !== id)
    );

    setSelectedHotelId(null);
    setScreen("list");
  };

  //編集する時
  const handleEditHotel = (hotel) => {
    setName(hotel.name);
    setCity(hotel.city);
    setRating(hotel.rating);
    setImages(hotel.images ?? (hotel.image ? [hotel.image] : []));
    setDate(hotel.date);
    setType(hotel.type);
    setMemo(hotel.memo);

    setEditingHotelId(hotel.id);

    setScreen("form")
  }

  //キャンセル
  const handleCancelEdit = () => {
    setName("");
    setCity("");
    setRating("");
    setImages([]);
    setDate("");
    setType("");
    setMemo("");
    setEditingHotelId(null);
    setScreen("detail");
  }

  //画像圧縮
  const resizeImage = (imageData) => {
    return new Promise((resolve) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

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

  const readAndResizeImage = (file) => {
    return new Promise((resolve) => {

      const reader = new FileReader();

      reader.addEventListener("load", async () => {
        const resizedImage = await resizeImage(reader.result);
        resolve(resizedImage);
      });

      reader.readAsDataURL(file);
    });
  };


  // hotelListが変更されたときにlocalStorageへ保存する
  useEffect(() => {
    localStorage.setItem(
      "hotelList",
      JSON.stringify(hotelList) /*配列やオブジェクトを文字列に変換する*/
    );
  }, [hotelList]);

  const selectedHotel = hotelList.find(
    (hotel) => hotel.id === selectedHotelId
  );

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

  const handleSelectHotel = (id) => {
    setSelectedHotelId(id);
    setCurrentImageIndex(0);
    setScreen("detail");
  }

  let content;

  //詳細画面
  if (screen === "detail" && selectedHotel) {
    content = (
      <main className="container detail-page">
        <button
          className="back-link"
          onClick={() => {
            setSelectedHotelId(null);
            setScreen("list");
          }}>
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
              {(selectedHotel.images ?? (selectedHotel.image ? [selectedHotel.image] : [])).map(
                (image, index) => (
                  <img
                    key={index}
                    className="detail-image"
                    src={image}
                    alt={`${selectedHotel.name} ${index + 1}`}
                  />
                )
              )}
            </div>

            <div className="image-dots">
              {(selectedHotel.images ?? (selectedHotel.image ? [selectedHotel.image] : [])).map(
                (image, index) => (
                  <span
                    key={index}
                    className={index === currentImageIndex ? "active" : ""}
                  >
                    ●
                  </span>
                )
              )}
            </div>
          </div>

          <div className="detail-content">
            <h1>{selectedHotel.name}</h1>

            <p className="detail-rating">
              {selectedHotel.rating}
            </p>
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
              <p className="detail-memo">
                {selectedHotel.memo}</p>
            )}

            <div className="detail-actions">
              <button
                className="secondary-button"
                onClick={() => handleEditHotel(selectedHotel)}>
                編集
              </button>

              <button
                className="delete-button"
                onClick={() => handleDeleteHotel(selectedHotel.id)}>
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
          className="back-link"
          onClick={() => {
            if (editingHotelId !== null) {
              setScreen("detail");
            } else {
              setScreen("list");
            }
          }
          }>
          {editingHotelId !== null ? "← 詳細に戻る" : "← 一覧に戻る"}
        </button>

        <div className="form-layout">

          <div className="form-intro">
            <h1>
              {editingHotelId !== null
                ? "ホテルを編集する" : "ホテルを登録する"}
            </h1>
            <p className="form-intro-note">
              宿泊したホテルの記録を残します。
            </p>
          </div>

          <div className="hotel-form">

            <label className="field">
              <span>ホテル名</span>
              <input
                type="text"
                placeholder="入力してください"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <label className="field">
              <span>地域</span>
              <input
                type="text"
                placeholder="入力してください"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </label>

            <label className="field">
              <span>評価</span>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                <option value="">選択してください</option>
                <option value="★★★★★">★★★★★</option>
                <option value="★★★★☆">★★★★☆</option>
                <option value="★★★☆☆">★★★☆☆</option>
                <option value="★★☆☆☆">★★☆☆☆</option>
                <option value="★☆☆☆☆">★☆☆☆☆</option>
              </select>
            </label>

            <label className="field">
              <span>宿泊日</span>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>

            <label className="field">
              <span>種類</span>

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
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
                rows="6"
                placeholder="空間、朝食、接客、また泊まりたい理由など"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
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

                  setImages([...images, ...resizedImages]);
                }}
              />
            </label>

            {images.length > 0 && (
              <div className="field-full">
                <p>現在の画像</p>
                {images.map((image, index) => (
                  <div key={index}>
                    <img
                      src={image}
                      alt="現在登録されているホテル画像"
                      style={{ width: "200px" }}
                    />

                    <button
                      type="button"
                      onClick={() => {
                        const updatedImages = images.filter(
                          (image, imageIndex) => imageIndex !== index
                        );

                        setImages(updatedImages);
                      }}
                    >
                      削除
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="form-actions field-full">
              {editingHotelId !== null && (
                <button
                  className="secondary-button"
                  onClick={handleCancelEdit}>
                  キャンセル
                </button>
              )}

              <button
                className="button"
                onClick={handleAddHotel} >
                {editingHotelId !== null ? "更新" : "登録"}
              </button>
            </div>

          </div>
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
            className="button heading-button"
            onClick={() => {
              setName("");
              setCity("");
              setRating("");
              setImages([]);
              setEditingHotelId(null);
              setScreen("form");
            }}>
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
      </main >
    );
  }

  return (
    <>
      <Header
        onHome={() => setScreen("list")}
        onAdd={() => {
          setName("");
          setCity("");
          setRating("");
          setImages([]);
          setEditingHotelId(null);
          setScreen("form");
        }}
      />

      {content}
    </>
  )

}

export default App;
