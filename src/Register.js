import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth, db, storage } from "./FirebaseConfig.js";
import { Navigate, Link } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";

const Register = () => {
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerImage, setRegisterImage] = useState(null);

    // image登録
    const handleImageChange = (e) => {
        const image = e.target.files[0];
        setRegisterImage(image);
    };

    // 登録画面
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                registerEmail,
                registerPassword
            );
            const userRef = await addDoc(collection(db, "users"), {
                user_id: userCredential.user.uid,
                email: registerEmail,
                password: registerPassword,
            });

            // ユーザーUIDに基づいて画像を保存
            if (registerImage) {
                const storageRef = ref(storage, `user_images/${userCredential.user.uid}.jpg`);
                await uploadBytes(storageRef, registerImage);
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
                            <label>画像</label>
                            <input
                                name="image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageChange(e)}
                            />
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
