import { QUERY } from "@/constants/api";
import { NO_ACCESS_TOKEN } from "@/constants/errorName";
import { User } from "@/types/user";
import { AlertError } from "@/utils/alertError";
import { request } from "@/utils/request";
import axios from "axios";
import { useQuery } from "simple-react-query";

const getUser = async () => {
  try {
    const response = await request.get(QUERY.USER);

    return response.data;
  } catch (error) {
    if (!axios.isAxiosError(error)) {
      throw new AlertError("알 수 없는 에러입니다.");
    }

    if (error.response?.data.code === 806 || error.response?.data.code === 801) {
      const newError = new Error("액세스 토큰이 존재하지 않습니다.");
      newError.name = NO_ACCESS_TOKEN;

      throw newError;
    }

    throw new AlertError("유저정보 조회에 실패하였습니다.\n잠시 후 다시 시도해주세요.");
  }
};

export const useUser = () => {
  const {
    data: user,
    isLoading,
    error,
    refetch: refetchUser,
    isSuccess,
    setData: setUser,
    isFetched
  } = useQuery<User | undefined>({
    query: getUser,
    enabled: false
  });

  return {
    user,
    isLoading,
    error,
    refetchUser,
    isSuccess,
    setUser,
    isFetched
  };
};
