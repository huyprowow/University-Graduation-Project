import { useOverviewStore } from "@/store/overview";
import { useState } from "react";

export const useOverview = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { overview, setOverview } =useOverviewStore((state) => state);

  const getOverview = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/overview", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response) {
        const data = await response.json();
        console.log(data);
        setOverview(data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    overview,
    setLoading,
    getOverview,
  };
};
