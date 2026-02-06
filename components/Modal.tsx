"use client";
import React, { useState } from "react";
import { Moon, Sun, Trash2 } from "lucide-react";

export function Button() {
  const handleClick = () => {
    const modal = document.getElementById(
      "settings",
    ) as HTMLDialogElement | null;
    modal?.showModal();
  };
  return <button onClick={handleClick}>Settings</button>;
}

export function Modal({ theme }: { theme: "light" | "dark" }) {
  const [asset,setAsset]= useState<"images"|"videos"|"account">()
  const handleClick = (asset: "images" | "videos"|"account") => {
    setAsset(asset)
    const modal = document.getElementById(
      "delete",
    ) as HTMLDialogElement | null;
    modal?.showModal();
  };
  const handleDelete = () => {
    console.log("Deleted")
  }
  const isDark = theme === "dark";

  function toggleTheme() {
    const next = isDark ? "light" : "dark";
    document.cookie = `theme=${next}; path=/; max-age=31536000`;
    location.reload();
  }
  return (
    <>
      <dialog id="settings" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="flex font-bold text-lg text-base-content justify-center">
            Settings
          </h3>
          <p className="py-4 text-base-content">
            Press ESC key or click outside or click the button below to close
          </p>
          <div className="flex flex-row justify-between my-2">
            <label className="label label-text text-sm font-semibold text-base-content mb-1 capitalize">
              Theme : {theme.toString()}
            </label>
            <label className="swap swap-rotate">
              <input type="checkbox" checked={isDark} onChange={toggleTheme} />

              <Sun size={24} className="swap-on" />
              <Moon size={24} className="swap-off" />
            </label>
          </div>
          <span className="flex flex-row justify-center text-gray-500">
            Deleting assets instantly free up your storage again
          </span>
          <div className="flex flex-row justify-between my-4">
            <label className="label label-text text-sm font-semibold text-base-content mb-1">
              Delete Images
            </label>
            <Trash2
              size={18}
              className="text-red-600"
              onClick={() => handleClick("images")}
            />
          </div>
          <div className="flex flex-row justify-between my-4">
            <label className="label label-text text-sm font-semibold text-base-content mb-1">
              Delete Videos
            </label>
            <Trash2
              size={18}
              className="text-red-600"
              onClick={() => handleClick("videos")}
            />
          </div>
          <span className="flex flex-row justify-center text-red-700">
            This action is not recommended as this can't be undone
          </span>
          <div className="flex flex-row justify-between my-4">
            <label className="label label-text text-sm font-semibold text-base-content mb-1">
              Delete Account
            </label>
            <Trash2
              size={18}
              className="text-red-600"
              onClick={() => handleClick("account")}
            />
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn bg-amber-400 text-black">Close</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      <ConfirmModal text={asset ?? ""} fn={handleDelete} />
    </>
  );
}

export function ConfirmModal({ text, fn }: { text: string, fn: ()=>void }) {
  return (
    <dialog id="delete" className="modal  modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Are you sure?</h3>
        <p className="py-4">You want to delete {text==="account"?"your":"all"} {text} permanently</p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn mx-3 bg-red-500 text-white" onClick={() => fn()}>
              Delete
            </button>
            <button className="btn bg-green-500 text-white">Cancel</button>
          </form>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
