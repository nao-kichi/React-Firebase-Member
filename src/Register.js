import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth, db, storage } from "./FirebaseConfig.js";
import { Navigate, Link } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import axios from 'axios';

const Register = () => {
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerUsername, setRegisterUsername] = useState("");
    const [registerImage, setRegisterImage] = useState(null);

    // zipcode API
    const [zipCode, setZipCode] = useState('');
    const [prefecture, setPrefecture] = useState('');
    const [city, setCity] = useState('');
    const [streetAddress, setStreetAddress] = useState('');

    const handleZipCodeChange = (event) => {
        const { value } = event.target;
        setZipCode(value);
    };

    const handleSearchAddress = () => {
        // 正規表現を使用して半角英数字7桁のみのバリデーションを行う
        const isValidZipCode = /^[0-9A-Za-z]{7}$/.test(zipCode);

        if (isValidZipCode) {
            const url = `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipCode}`;

            axios.get(url)
                .then((response) => {
                    const { data } = response;

                    // APIレスポンスから住所情報を取得
                    const { results } = data;
                    const { address1, address2, address3 } = results[0];

                    // 取得した住所情報をフォームにセット
                    setPrefecture(address1);
                    setCity(address2);
                    setStreetAddress(address3);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        } else {
            alert('半角英数字7桁で入力してください');
        }
    };

    // image登録
    const handleImageChange = (e) => {
        const image = e.target.files[0];
        setRegisterImage(image);
    };

    // 登録画面
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (registerUsername === "") {
            alert("ユーザー名を入力してください");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                registerEmail,
                registerPassword
            );
            // eslint-disable-next-line
            const userRef = await addDoc(collection(db, "users"), {
                user_id: userCredential.user.uid,
                email: registerEmail,
                password: registerPassword,
                username: registerUsername,
                zipcode: zipCode,
                prefecture: prefecture,
                city: city,
                streetAddress: streetAddress
            });

            // ユーザーUIDに基づいて画像を保存
            if (registerImage) {
                const storageRef = ref(storage, `user_images/${userCredential.user.uid}.jpg`);
                setTimeout(async () => {
                    await uploadBytes(storageRef, registerImage);
                }, 1000); // setTimeout
            }
        } catch (error) {
            alert("正しく入力してください");
        }
    };

    const [user, setUser] = useState("");

    useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
    }, []);

    return (
        <>
            {user ? (
                <Navigate to={`/`} />
            ) : (
                <>
                    <h1>新規登録</h1>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>メールアドレス</label>
                            <input
                                name="email"
                                type="email"
                                value={registerEmail}
                                onChange={(e) => setRegisterEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>パスワード</label>
                            <input
                                name="password"
                                type="password"
                                value={registerPassword}
                                onChange={(e) => setRegisterPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>ユーザー名</label>
                            <input
                                name="username"
                                type="text"
                                value={registerUsername}
                                onChange={(e) => setRegisterUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>画像</label>
                            <input
                                name="image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e)}
                            />
                        </div>
                        <div><label>郵便番号
                                <input type="text" value={zipCode} onChange={handleZipCodeChange} />
                            </label>
                            <button name="searchButton" type="button" onClick={handleSearchAddress}>住所検索</button>
                            <label>都道府県
                                <input type="text" value={prefecture} readOnly />
                            </label>
                            <label>市区町村
                                <input type="text" value={city} readOnly />
                            </label>
                            <label>丁目番地
                                <input type="text" value={streetAddress} readOnly />
                            </label>
                        </div>
                        <button>登録する</button>
                        <p>ログインは<Link to={`/login/`}>こちら</Link></p>
                    </form>
                </>
            )}
        </>
    );
};

export default Register;