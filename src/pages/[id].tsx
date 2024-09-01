// pages/[id].tsx

import { GetStaticPaths, GetStaticProps } from 'next';

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [], // 必要なパスを指定
    fallback: false, // true または 'blocking' に設定可能
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {}, // 必要な props を返す
  };
};

const Page = () => {
  return <div>Page Content</div>;
};

export default Page;
