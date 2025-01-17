import '../components/styles/404-Bad-Request.css'
function BadRequest () {


    return (
        <section className="page_404">
            <div className="container">
                <div className="row">
                    <div className="col-sm-12 ">
                        <div className="col-sm-10 col-sm-offset-1  text-center">
                            <div className="four_zero_four_bg">
                                <h1 className="text-center ">404</h1>
                            </div>
                            <div className="content_box_404">
                                <h3 className="h2">
                                    Look like you're lost
                                </h3>
                                <p>the page you are looking for not avaible!</p>
                                <a href="/" className="link_404">Go to Home</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <a href="https://dev.to/stackfindover/35-html-404-page-templates-5bge" hidden>Designer</a>
        </section>

    );
}

export default BadRequest