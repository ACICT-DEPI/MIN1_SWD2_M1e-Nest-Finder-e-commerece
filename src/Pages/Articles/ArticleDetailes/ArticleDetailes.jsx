import { useEffect, useState } from "react";
import { Container, Row, Col, Alert, Button } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import "./ArticleDetailes.css";
import Footer from "../../../Components/Footer/Footer.jsx";
import api from "../../../API/ApiLink.jsx";
import usePageSEO from "../../../hooks/usePageSEO";
import AddComment from "../../../Components/Comments/AddComment.jsx";
import CommentCard from "../../../Components/Comments/CommentCard.jsx";
import Header from "../../../Components/Header/Header.jsx";
import Share from "../../../Components/Cards/Share.jsx";
import OverPage from "../../../Components/OverPage/OverPage.jsx";
import ArticleCards from "../../../Components/Articles/ArticleCards.jsx";

export default function ArticleDetailes() {
  const [article, setArticle] = useState({});
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [overlay, setOverlay] = useState(false);
  const { id } = useParams();
  // استرجاع مقاله حسب اللينك
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setOverlay(true);
        const response = await api.get(`/articles/${id}`);
        setArticle(response.data.data);
        setRelatedPosts(response.data.related_posts)
      } catch (error) {
        setArticle("");
        console.log(error);
      } finally {
        setOverlay(false);
      }
    };
    fetchArticle();
  }, [id]);

  // Set default SEO settings
  usePageSEO({
    title: article.title || "مقالات",
    description: article.meta_description || "",
    keywords: article.key_words ? article.key_words.split(",") : [],
  });
  return (
    <>
      <Header />
      {overlay ? (
        <OverPage />
      ) : (
        <>
          {article ? (
            <>
              <h1 className="text-center title-page py-1 pb-2 container my-3">
                {article.title}
              </h1>
              <Container dir="rtl">
                <Row className="detailes-page">
                  <Col>
                    <div style={{ position: "relative" }}>
                      <img
                        src={article.article_image}
                        alt={article.title}
                        className="main-title-img"
                      />
                      {article.category_id&& (
                        <span
                          style={{
                            position: "absolute",
                            bottom: "0px",
                            right: "0px",
                          }}
                        >
                          <Link
                            to={`/blog/type/${article.category_id.category_name}`}
                            className="categoryLink"
                          >
                            {article.category_id.category_name.replace(/-/g, " ")}
                          </Link>
                        </span>
                      )}
                    </div>

                    <div className="rtl mt-4">
                      <div
                        className="articleCont"
                        dangerouslySetInnerHTML={{
                          __html: article.article_body,
                        }}
                      />
                    </div>
                    {article.tags && article.tags.length > 0 ? (
                      <div className="tag-cont">
                        {article.tags.map((tag,index) => (
                          <Button
                          key={index}
                            as={Link}
                            to={`/blog/tags/${tag.replace(/ /g, "-")}`}
                            variant="outline-info"
                            className="tagBtn"
                          >
                            {tag}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <></>
                    )}
                  </Col>
                </Row>
              </Container>
            </>
          ) : (
            <Alert key="danger" className="text-center" variant="danger">
              404 عفوا, المدونة ليست موجوده
            </Alert>
          )}
          <hr />

          {relatedPosts.length && (
            <>
              <h2 className="text-center title-page py-1 pb-2 container my-3">
                مقالات قد تعجبك
              </h2>
              <ArticleCards articles={relatedPosts} />
            </>
          )}

          <hr />
          <Container>
            <CommentCard article_id={article._id} />
            <hr />
            <AddComment article_id={article._id} />
          </Container>
          <Footer />
          <Share
            text={`مدونه عن ${article.title} فى موقع Nest Finder`}
            url={`https://depi-final-project.vercel.app//blog/${encodeURIComponent(id)}`}
          />
        </>
      )}
    </>
  );
}
