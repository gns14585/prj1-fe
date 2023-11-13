import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";

export function MemberView() {
  const [member, setMember] = useState(null);
  // /member?id=userid
  const [params] = useSearchParams();
  // urlSearchParams 은 배열로 구조분해할당 하게됨
  // list를 하나씩 출력해서 보여주기 떄문 [배열]

  useEffect(() => {
    axios
      .get("/api/member?" + params.toString())
      .then((response) => setMember(response.data));
  }, []);

  if (member === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <h1>{member.id}님 정보</h1>
      <FormControl>
        <FormLabel>password</FormLabel>
        <Input type="text" value={member.password} readOnly />
      </FormControl>

      <FormControl>
        <FormLabel>Email</FormLabel>
        <Input value={member.email} readOnly />
      </FormControl>

      <Button colorScheme="blue">수정</Button>
      <Button colorScheme="red">삭제</Button>
    </Box>
  );
}
