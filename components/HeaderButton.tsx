"use client";
import React, { useEffect, useState } from "react";
import { Gem, Info } from "lucide-react";
import toast from "react-hot-toast";
import { useUser } from "@clerk/nextjs";

function HeaderButton() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [tPoint, setTPoint] = useState<number>(0);
  const [maxTpoint, setMaxTPoint] = useState<number>(0);
  useEffect(() => {
    if (!isSignedIn) return;
    if (!isLoaded) return;
    setTPoint(Number(user.publicMetadata.tPoint));
    setMaxTPoint(Number(user.publicMetadata.maxTPoint));
  }, [user]);

    function indicator(value: number) {
        if (value <= 70) return "text-red-600"
        else if (value>70 && value < 300) return "text-amber-400"
        else return 
        
    }
  return (
    <>
      {maxTpoint!=0&&tPoint >= maxTpoint && (
        <div
          className="text-amber-400"
          onClick={() => {
            toast("Your Transformation point exhausted");
          }}
        >
          <Info size={24} />
        </div>
      )}
      <span className={`${indicator(maxTpoint-tPoint)}`}>{maxTpoint-tPoint}</span>
      <div
        onClick={() => {
          toast(`You have ${maxTpoint-tPoint} gems remaining`);
        }}
      >
        <Gem size={24} color="#0ea5e9" />
      </div>
    </>
  );
}

export default HeaderButton;
