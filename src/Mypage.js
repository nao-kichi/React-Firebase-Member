import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, storage } from "./FirebaseConfig.js";
import { useNavigate, Navigate } from "react-router-dom";
import { getDownloadURL, ref } from "firebase/storage";

const Mypage = () => {
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        setTimeout(async () => {
          try {
            const uid = currentUser.uid;
            const storageRef = ref(storage, `user_images/${uid}.jpg`);
            const url = await getDownloadURL(storageRef);
            setImageUrl(url);
          } catch (error) {
            setError("画像が存在しません。");
          }
          // setTime 500
        }, 1500);
      }
    });
  }, [auth, storage]);

  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    alert("ログアウトしました");
    navigate("/login/");
  };

  return (
    <>
      {!loading && (
        <>
          {!user ? (
            <Navigate to={`/login/`} />
          ) : (
            <>
              <h1>マイページ</h1>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                {imageUrl && <img src={imageUrl} alt="プロフィール画像" style={{ width: '150px', height: '150px' }} />}
              </div>
              <p>{user?.email}</p>
              {error && <p>{error}</p>}
              <button onClick={logout}>ログアウト</button>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Mypage;
