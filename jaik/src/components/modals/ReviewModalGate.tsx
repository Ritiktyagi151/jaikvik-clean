"use client";

import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

const ReviewModal = dynamic(() => import("./ReviewModal"), {
  ssr: false,
  loading: () => null,
});

const ReviewModalGate = () => {
  const isOpen = useSelector((state: RootState) => state.action.isReviewModal);

  return isOpen ? <ReviewModal /> : null;
};

export default ReviewModalGate;
