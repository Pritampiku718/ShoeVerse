import { useState, useCallback, useRef } from "react";
import { revenueAPI } from "../services/api";

export const useRevenue = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cache = useRef({});
  const abortControllerRef = useRef(null);

  const getRevenueData = useCallback(async (params = {}) => {
    const { range = "month" } = params;
    const cacheKey = `revenue-${range}`;

    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    // Return cached data if available and not expired (30 seconds)
    if (
      cache.current[cacheKey] &&
      Date.now() - cache.current[cacheKey].timestamp < 30000
    ) {
      console.log("Using cached revenue data");
      return { data: cache.current[cacheKey].data };
    }

    setLoading(true);
    setError(null);

    try {
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();

      if (range === "week") {
        startDate.setDate(endDate.getDate() - 7);
      } else if (range === "month") {
        startDate.setMonth(endDate.getMonth() - 1);
      } else if (range === "quarter") {
        startDate.setMonth(endDate.getMonth() - 3);
      } else if (range === "year") {
        startDate.setFullYear(endDate.getFullYear() - 1);
      }

      console.log("Fetching revenue data from API...");

      // Make API calls with abort signal
      const [summaryRes, rangeRes, categoryRes, paymentRes] = await Promise.all(
        [
          revenueAPI.getSummary({ signal: abortControllerRef.current.signal }),
          revenueAPI.getByRange(
            startDate.toISOString().split("T")[0],
            endDate.toISOString().split("T")[0],
            { signal: abortControllerRef.current.signal },
          ),
          revenueAPI.getByCategory({
            signal: abortControllerRef.current.signal,
          }),
          revenueAPI.getByPaymentMethod({
            signal: abortControllerRef.current.signal,
          }),
        ],
      );

      console.log("API Responses:", {
        summary: summaryRes.data,
        range: rangeRes.data,
        category: categoryRes.data,
        payment: paymentRes.data,
      });

      // Extract data
      const summaryData = summaryRes.data?.data || summaryRes.data || {};
      const rangeData = rangeRes.data?.data || rangeRes.data || {};
      const categoryData = categoryRes.data?.data || categoryRes.data || [];
      const paymentData = paymentRes.data?.data || paymentRes.data || [];

      // Get totals
      const totalRevenue = summaryData.total || rangeData.total || 0;
      const totalOrders = summaryData.orders || rangeData.orders || 0;
      const aov = summaryData.averageOrderValue || 0;

      // Format daily data
      const apiDailyData = summaryData.daily || rangeData.daily || [];
      const dailyDataMap = {};
      apiDailyData.forEach((item) => {
        dailyDataMap[item._id] = {
          revenue: item.revenue,
          orders: item.orders,
        };
      });

      // Generate all days in range
      const allDays = [];
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const dateStr = currentDate.toISOString().split("T")[0];
        const displayDate = currentDate.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        const existingData = dailyDataMap[dateStr] || { revenue: 0, orders: 0 };

        allDays.push({
          _id: dateStr,
          date: displayDate,
          fullDate: dateStr,
          revenue: existingData.revenue,
          orders: existingData.orders,
          name: displayDate,
          value: existingData.revenue,
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Format monthly data
      const apiMonthlyData = summaryData.monthly || rangeData.monthly || [];
      const monthlyDataMap = {};
      apiMonthlyData.forEach((item) => {
        monthlyDataMap[item._id] = {
          revenue: item.revenue,
          orders: item.orders,
        };
      });

      // Generate last 12 months
      const last12Months = [];
      const today = new Date();

      for (let i = 11; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const monthKey = `${year}-${month.toString().padStart(2, "0")}`;
        const monthName = date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });

        const existingData = monthlyDataMap[monthKey] || {
          revenue: 0,
          orders: 0,
        };

        last12Months.push({
          _id: monthKey,
          month: monthName,
          revenue: existingData.revenue,
          orders: existingData.orders,
          name: monthName,
          value: existingData.revenue,
        });
      }

      // Format quarterly data
      const apiQuarterlyData =
        summaryData.quarterly || rangeData.quarterly || [];
      const formattedQuarterly = apiQuarterlyData.map((item) => {
        const quarterNum = item._id?.quarter || 1;
        const year = item._id?.year || new Date().getFullYear();
        return {
          ...item,
          name: `Q${quarterNum} ${year}`,
          revenue: item.revenue || 0,
          orders: item.orders || 0,
        };
      });

      const combinedData = {
        revenue: {
          total: totalRevenue,
          aov: aov,
          conversionRate: 3.2,
          daily: allDays,
          monthly: last12Months,
          byCategory: categoryData,
          byPaymentMethod: paymentData,
          quarterly: formattedQuarterly,
        },
        orders: {
          total: totalOrders,
        },
      };

      console.log("Combined Revenue Data:", {
        total: combinedData.revenue.total,
        orders: combinedData.orders.total,
        dailyDays: combinedData.revenue.daily.length,
        monthlyMonths: combinedData.revenue.monthly.length,
      });

      // Cache the data
      cache.current[cacheKey] = {
        data: combinedData,
        timestamp: Date.now(),
      };

      return { data: combinedData };
    } catch (err) {
      if (err.name === "CanceledError" || err.message === "canceled") {
        console.log("Request cancelled");
        return null;
      }
      console.error("Error fetching revenue data:", err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  }, []);

  return { getRevenueData, loading, error };
};
