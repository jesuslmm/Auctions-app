import Layout from "@/components/onPageComponents/layout";
import { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { Auction } from "../../../types";
import Image from "next/image";
import QuestionForm from "@/components/onProductComponents/questionForm";
import MakeBid from "@/components/onProductComponents/makeBid";
import CountdownTimer from "@/components/countdown/CountdownTimer";
import { newQuestionType } from "../../../types";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { User } from "../../../types";
import AnswerQuestion from "@/components/onProductComponents/answerQuestion";
import { HeartIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default function Product({ auction }: { auction: Auction }) {
  const router = useRouter();

  const [questions, setQuestions] = useState(auction.Comment);
  const [listed, setListed] = useState<boolean>();

  const [listRef] = useAutoAnimate();
  const [finished, setFinished] = useState(auction.finished);

  const [winning, setWinning] = useState<boolean>();

  const [bid, setBid] = useState(auction.bid!.actual_bid);
  const [userData, setUserData] = useState<User>();

  useEffect(() => {
    const handleWinning = () => {
      if (userData?.id === auction.bid.buyerId) {
        setWinning(true);
      } else {
        setWinning(false);
      }
    };

    handleWinning();
    async function fetchData() {
      const response = await fetch("/api/user/getUserInfo");
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      setUserData(data);
    }
    async function checkListed() {
      const response = await fetch(`/api/auction/listed/${auction.id}`);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      const { message } = data;
      if (message === true) {
        setListed(true);
      } else {
        setListed(false);
      }
    }
    fetchData();
    checkListed();
  }, [auction.id, userData?.id, auction.bid.buyerId]);

  const handleNewBid = async (newBid: number) => {
    const response = await fetch("/api/bid/newBid", {
      method: "PUT",
      body: JSON.stringify({
        bid: newBid,
        productId: auction.id,
      }),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    setBid(newBid);
    setWinning(true);
  };

  const handleNewQuestion = (question: newQuestionType) => {
    setQuestions((prevQuestions) => [question, ...prevQuestions]);
  };

  const handleFinishTime = async () => {
    if (finished !== true) {
      const response = await fetch("/api/auction/finishAuction", {
        method: "POST",
        body: JSON.stringify(auction.id),
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      setFinished(true);
    }
  };

  const handleNewAnswer = ({
    answerToQuestion,
    questionId,
  }: {
    answerToQuestion: string;
    questionId: string;
  }) => {
    const newQuestions = questions.map((quest) =>
      quest.id === questionId ? { ...quest, answer: answerToQuestion } : quest
    );

    setQuestions(newQuestions);
  };

  const handleCategoryClick = () => {
    router.push(`/posts/categories/${auction.category}`);
  };

  const handleListed = async () => {
    const response = await fetch("/api/auction/listed/editListed", {
      method: "PUT",
      body: JSON.stringify({
        id: auction.id,
        listed: listed,
      }),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    setListed(!listed);
  };

  return (
    <Layout>
      <div className="bg-white h-screen p-8 rounded-md m-20 mt-8">
        <div className="grid grid-cols-2 gap-24 ">
          <div>
            <div className="flex items-center justify-center py-10 -mt-10">
              <Image
                className="rounded-sm"
                src={auction.image}
                alt={auction.product}
                width={500}
                height={500}
                style={{ width: "500px", height: "500px" }}
              />
            </div>
          </div>
          <div className="grid grid-row-2 items-center justify-center text-center border-2 rounded-lg ml-30 mr-28">
            <div>
              <div className="flex flex-row">
                <p className="font-bold  text-3xl text-center flex-grow my-3">
                  {auction.product}{" "}
                  {finished !== true ? (
                    <span className="mt-1 ml-3 absolute">
                      <HeartIcon
                        onClick={handleListed}
                        className={`w-6 h-6 transition-all cursor-pointer ${
                          listed == true
                            ? "text-red-500 hover:text-black hover:scale-90"
                            : "hover:text-red-500 hover:scale-110"
                        }`}
                      />
                    </span>
                  ) : null}
                </p>
              </div>
              <div className="">
                <p className="text-xs  text-blue-300 hover:text-blue-500 hover:cursor-pointer">
                  See payments methods
                </p>
                <p className="text-sm my-3">
                  The delivery is agreed with the seller
                </p>
                <p className="text-sm my-7">
                  Category:
                  <span
                    onClick={handleCategoryClick}
                    className="text-blue-300 font-medium hover:cursor-pointer hover:text-blue-500 hover:scale-105"
                  >
                    {" "}
                    {auction.category}
                  </span>
                </p>
              </div>
              {finished == true ? (
                <div>
                  <p className="my-6 font-bold text-xl text-green-500">
                    This auction is finished!
                  </p>
                  {winning ? (
                    <p className="mt-3 px-10">
                      <span className="font-bold">CONGRATS</span>, you are the
                      winner! stay tunned to contact the seller
                    </p>
                  ) : (
                    <div className="my-8">
                      The winner of this auction is{" "}
                      <span className="font-bold text-xl text-green-500">
                        {userData?.name}
                      </span>
                      !
                    </div>
                  )}
                  <p className="my-6 font-light">
                    Winner bid:
                    <span className="font-bold ml-1 text-xl text-green-500">
                      ${auction.bid.actual_bid}
                    </span>
                  </p>
                </div>
              ) : winning == true ? (
                <div>
                  <p className="border-2 p-2 rounded-xl my-5 border-blue-400 bg-blue-400 text-white font-medium animate-pulse">
                    You are winning this auction!
                  </p>
                </div>
              ) : null}
              {finished == true ? null : (
                <MakeBid bid={bid} handleNewBid={handleNewBid} />
              )}
            </div>
          </div>
        </div>
        {finished ? null : (
          <div>
            <CountdownTimer
              countdownTimestamps={auction.finishTime}
              handleFinishTime={handleFinishTime}
              isFinished={finished}
            />
          </div>
        )}

        <div className="px-16 pr-40 py-16">
          <p className="font-bold text-2xl mb-7">Description</p>
          <p className="font-light text-lg">{auction.description}</p>
        </div>
        <div className="px-16 mt-12">
          <p className="font-medium text-xl mb-7">
            C<span className="font-light">&</span>A
          </p>
          {auction.finished ? null : (
            <QuestionForm
              productId={auction.id}
              handleNewQuestion={handleNewQuestion}
            />
          )}
          <div ref={listRef} className="mt-10 pb-56">
            <p className="mb-1 text-lg font-bold">COMMENTS</p>
            <p className="mb-8 font-extralight">
              this comments can be answered by the seller!
            </p>
            {questions.map((comment) => (
              <div key={comment.id} className="mb-8">
                <p>{comment.comment}</p>
                {comment.answer ? (
                  <div className="ml-2">
                    <p className="font-thin mt-1">L</p>
                    <p className=" ml-4 -mt-5 font-light">{comment.answer}</p>
                  </div>
                ) : auction.finished !== true ? (
                  auction.userId === userData?.id ? (
                    <AnswerQuestion
                      commentId={comment.id}
                      handleNewAnswer={handleNewAnswer}
                    />
                  ) : null
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const id = context.params?.id as string;

    const auction = await prisma.auction.findUnique({
      where: {
        id: id,
      },
      include: {
        bid: true,
        Comment: true,
      },
    });

    if (!auction) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        auction,
      },
    };
  } catch (err) {
    console.error((err as Error).message);
    return {
      props: {
        errors: (err as Error).message,
      },
    };
  }
};
