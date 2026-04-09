import ScrollAnimations from "./components/ScrollAnimations";
import WaitlistForm from "./components/WaitlistForm";

export default function Home() {
  return (
    <>
      <ScrollAnimations />

      <header className="header">
        <div className="header-sticky">
          <div className="header-badge">
            <span>현재 매칭 품질을 위해</span>
            <span>[서울 강남/서초 지역]</span>
            <span>사장님 50분만 선착순 모집</span>
          </div>
          <h1>
            <span className="h1-line">어차피 비워둘 당일 공실,</span>
            <br />
            <span className="h1-line">딱 5% 수수료로</span>
            <br />
            <span className="h1-line">빠르게 채워드립니다.</span>
          </h1>
          <p>
            고정 광고비나 복잡한 시스템 연동은 없습니다.
            <br />
            원할 때만 빈방을 올려 매일 꽉 찬 수익을 만드세요.
          </p>
        </div>
      </header>

      <section className="section-letter">
        <div className="badge wide">MAKER&apos;S LETTER</div>
        <div className="letter-card">
          <h2>
            어느 사장님과의 인터뷰에서
            <br />
            출발했습니다.
          </h2>
          <div className="letter-body">
            <p>안녕하세요.</p>
            <p>
              최근 숙박업 사장님들을 만나 뵈며, 비싼 플랫폼 수수료와 상단 노출 광고비
              <br />
              때문에 당일 남는 방을 눈물을 머금고 비워둬야 한다는 이야기를 들었습니다.
            </p>
            <p>그래서</p>
            <p>
              <span className="highlight">
                고정비 없이, 거래가 성사될 때만 정직하게 5%를 받는 &apos;진짜 사장님을 위한 땡처리
                공간&apos;{" "}
              </span>
              을 기획하게 되었습니다.
            </p>
            <p>밑져야 본전인 이 가벼운 테스트에 함께하실 사장님들을 기다립니다.</p>
          </div>
          <div className="letter-sender">
            <div className="sender-avatar">Z</div>
            <div className="sender-info">
              <div className="name">ZOOP 팀 드림</div>
              <div className="desc">사장님의 공실 고민을 해결하기 위해</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-promise">
        <div className="promise-scroll-area" id="promiseScrollArea">
          <div className="promise-sticky">
            <div className="section-header">
              <div className="badge">OUR PROMISE</div>
              <h2>사장님께 드리는 3가지 약속</h2>
            </div>
            <div className="promise-stack">
              <div className="promise-card">
                <div className="promise-img-wrap">
                  <img src="/img1.png" alt="5% 수수료 일러스트" />
                </div>
                <div className="promise-text">
                  <h3>팔리지 않으면 0원, 성사 시에만 5%</h3>
                  <p>
                    기존 10~15% 수수료와 광고비에 지치셨죠? 방이 팔렸을 때만 5%를 받습니다.
                  </p>
                </div>
              </div>

              <div className="promise-card">
                <div className="promise-img-wrap">
                  <img src="/img2.png" alt="자유로운 업로드 일러스트" />
                </div>
                <div className="promise-text">
                  <h3>관리할 필요 없이, 내 맘대로 툭</h3>
                  <p>
                    매일 방 개수를 맞출 필요 없습니다.
                    <br />
                    갑자기 방이 남는 날에만 자유롭게 올리세요.
                  </p>
                </div>
              </div>

              <div className="promise-card">
                <div className="promise-img-wrap">
                  <img src="/img3.png" alt="빠른 수익화 일러스트" />
                </div>
                <div className="promise-text">
                  <h3>자정 전, 공실의 빠른 수익화</h3>
                  <p>
                    자정이 지나면 0원이 될 재고, 합리적인 할인가로 빠르게 매칭해 드립니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-waitlist">
        <div className="waitlist-header">
          <div className="badge">JOIN WAITLIST</div>
          <h2>사전 입점 대기자 등록</h2>
          <div className="desc">
            <p>현재 서비스 출시 전 수요를 파악하고 있습니다.</p>
            <p>대기 명단에 등록해주신 사장님들께는</p>
            <p>
              오픈 시{" "}
              <span className="highlight">가장 먼저 혜택 안내</span>를 드립니다.
            </p>
          </div>
        </div>
        <WaitlistForm />
      </section>

      <footer>
        <p>© 2026 ZOOP. All rights reserved.</p>
        <p>
          본 페이지는 서비스 출시 전 수요 검증을 위한 사전 대기자 모집 페이지입니다.
        </p>
      </footer>
    </>
  );
}
