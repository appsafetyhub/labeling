import { BLANK_PDF, Template, checkTemplate, generate } from '@appsafetyhub/generator';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Layout from '@theme/Layout';
import React, { useEffect, useRef, useState } from 'react';
import { useViewer } from '../hooks';
import { deNormalizeDatas, getFont, normalizeDatas } from '../libs/helper';
import DemoAppFooter from './DemoAppFooter';
import DemoAppGridForm from './DemoAppGridForm';
import DemoAppGridFormHeader from './DemoAppGridFormHeader';
import DemoAppHeader from './DemoAppHeader';
import DemoAppTemplateList from './DemoAppTemplateList';
import Divider from './Divider';

type Props = {
  title: string;
  description: string;
  thumbnail: string;
  templateItems: { id: string; jsonUrl: string; imgUrl: string }[];
};

const DemoApp = (props: Props) => {
  const { title, description, thumbnail, templateItems } = props;
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(templateItems[0].id);
  const [template, setTemplate] = useState<Template>({ basePdf: BLANK_PDF, schemas: [] });
  const [datas, setDatas] = React.useState<{ [key: string]: string }[]>([]);
  const [pdfCreationTime, setPdfCreationTime] = useState(0);
  const viewer = useViewer({ viewerRef, template });

  useEffect(() => {
    const selectedTemplateJsonUrl =
      templateItems.find((t) => t.id === selectedTemplateId)?.jsonUrl ?? '';
    if (!selectedTemplateJsonUrl) return;

    fetch(selectedTemplateJsonUrl)
      .then((_) => _.json())
      .then((t) => {
        checkTemplate(t);
        const emptyDatas = deNormalizeDatas(t.sampledata, t).map((row) =>
          Object.fromEntries(Object.entries(row).map(([key]) => [key, '']))
        );
        setDatas(emptyDatas);
        setTemplate(t);
      })
      .catch(alert);
  }, [selectedTemplateId]);

  const downloadPdf = async () => {
    const inputs = viewer?.getInputs() ?? [{}];
    const font = await getFont();

    const t0 = performance.now();
    const pdf = await generate({ template, inputs, options: { font } });
    const t1 = performance.now();

    setPdfCreationTime(t1 - t0);
    const blob = new Blob([pdf.buffer], { type: 'application/pdf' });
    window.open(URL.createObjectURL(blob));
  };

  const loadSampleData = () => {
    viewer?.setInputs(template.sampledata ?? []);
    setDatas(deNormalizeDatas(template.sampledata, template));
    alert('Sample Data loaded.\nPlease click "Download" button.');
  };

  return (
    <Layout title={title} description={description}>
      <Head>
        <meta property="og:image" content={useBaseUrl(thumbnail, { absolute: true })} />
      </Head>
      <DemoAppHeader title={title} description={description} thumbnail={thumbnail} />
      <main>
        <section className="margin-vert--lg">
          <DemoAppTemplateList
            selectedTemplateId={selectedTemplateId}
            templateItems={templateItems}
            onClick={(id) => {
              window.location.hash = '';
              window.location.hash = '#form';
              setSelectedTemplateId(id);
            }}
          />
        </section>
        <Divider />
        <section className="margin-vert--lg">
          <DemoAppGridFormHeader
            pdfCreationTime={pdfCreationTime}
            loadSampleData={loadSampleData}
            downloadPdf={downloadPdf}
          />
          <div className="container">
            <div className="row">
              <div className={'col col--6'} style={{ padding: 0 }}>
                <h3 className="padding-top--md">DataGrid</h3>
                <div style={{ overflow: 'scroll', height: 500 }}>
                  <DemoAppGridForm
                    datas={datas}
                    setDatas={(value) => {
                      setDatas(value);
                      viewer?.setInputs(normalizeDatas(value, template));
                    }}
                  />
                </div>
              </div>
              <div style={{ padding: 0 }} className={'col col--6'}>
                <h3 className="padding-top--md">Preview</h3>
                <div style={{ height: 500 }} ref={viewerRef}></div>
              </div>
            </div>
          </div>
        </section>
        <Divider />
        <section className="margin-vert--lg">
          <DemoAppFooter />
        </section>
        <Divider />
        <div className={'col col--12 margin-vert--lg'}>
          <div className="text--center">
            <Link className="button button--primary button--lg" to="/demo">
              Check out the other Demo Apps
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default DemoApp;
