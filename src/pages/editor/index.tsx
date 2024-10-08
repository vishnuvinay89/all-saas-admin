import React from 'react'
import dynamic from "next/dynamic";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// @ts-ignore
const Editor = dynamic(() => import('editor/Index'), { ssr: false });

const index = () => {
  return (
    <Editor />
  )
}

export default index

export async function getStaticProps({ locale }: any) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}