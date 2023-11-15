import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Textarea,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";

function CommentForm({ boardId }) {
  const [comment, setComment] = useState("");

  function handleSubmit() {
    axios.post("/api/comment/add", {
      boardId,
      comment,
    });
  }

  return (
    <Box>
      <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      <Button onClick={handleSubmit}>쓰기</Button>
    </Box>
  );
}

function CommentList({ boardId }) {
  const [commentList, setCommentList] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("id", boardId);

    axios
      // + 연산자(toString()) 때문에 .toString() 안적어도 됨 단, .toString()을 적어주는게 안전함
      .get("/api/comment/list?" + params)
      .then((response) => setCommentList(response.data));
  }, []);

  if (commentList == null) {
    return <Spinner />;
  }

  return (
    <Box>
      <h1>댓글</h1>
      {commentList.map((commentList) => (
        <Input value={commentList.comment} readOnly />
      ))}
    </Box>
  );
}

export function CommentContainer({ boardId }) {
  return (
    <Box>
      <CommentForm boardId={boardId} />
      <CommentList boardId={boardId} />
    </Box>
  );
}
