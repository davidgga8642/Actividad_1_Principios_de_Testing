import { renderHook, act } from "@testing-library/react";
import { waitFor } from "@testing-library/react";
import useFetchData from "../../hooks/useFetchData";

describe("useFetchData", () => {
  test("estado inicial: data=null, isLoading=true, error=null", () => {
    const mockFn = jest.fn().mockResolvedValue({ msg: "ok" });

    const { result } = renderHook(() => useFetchData(mockFn));

    expect(result.current.data).toBe(null);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBe(null);
  });

  test("fetch exitoso", async () => {
    const mockFn = jest.fn().mockResolvedValue({ msg: "ok" });

    const { result } = renderHook(() => useFetchData(mockFn));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toEqual({ msg: "ok" });
    expect(result.current.error).toBe(null);

    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  test("fetch con error", async () => {
    const mockFn = jest
      .fn()
      .mockRejectedValue(new Error("fail"));

    const { result } = renderHook(() => useFetchData(mockFn));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error?.message).toBe("fail");
    expect(result.current.data).toBe(null);
  });

  test("reload vuelve a ejecutar el fetch", async () => {
    const mockFn = jest
      .fn()
      .mockResolvedValueOnce({ msg: "first" })
      .mockResolvedValueOnce({ msg: "second" });

    const { result } = renderHook(() => useFetchData(mockFn));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.data).toEqual({ msg: "first" });
    expect(mockFn).toHaveBeenCalledTimes(1);

    
    await act(async () => {
      result.current.reload();
    });

    await waitFor(() => {
      expect(result.current.data).toEqual({ msg: "second" });
    });
    expect(mockFn).toHaveBeenCalledTimes(2);
  });
});