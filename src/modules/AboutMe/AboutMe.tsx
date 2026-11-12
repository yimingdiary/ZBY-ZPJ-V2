import { FramedTitle } from "../../design/FramedTitle";
import s from "./AboutMe.module.css";
export type AboutMeProps = {
  version: 1;
  title: string;
  name: string;
  englishName: string;
  portrait: string;
  portraitAlt: string;
  facts: { label: string; value: string }[];
  company: string;
  role: string;
  period: string;
  summary: string;
  achievements: { title: string; description: string }[];
  education: {
    school: string;
    qualification: string;
    major: string;
    period: string;
  }[];
  skills: { label: string }[];
};
export function AboutMe(p: AboutMeProps) {
  return (
    <section className={s.about} id="about" aria-label="个人介绍">
      <header className={s.header}>
        <FramedTitle title={p.title} />
        <p className={s.name}>{p.name}</p>
      </header>
      <div className={s.layout}>
        <figure className={s.portrait}>
          <img
            src={p.portrait}
            alt={p.portraitAlt}
            width="2100"
            height="2736"
            loading="lazy"
          />
          <figcaption>{p.englishName}</figcaption>
        </figure>
        <div className={s.details}>
          <section>
            <h3 className={s.sectionTitle}>
              基础信息 <span>Basic information</span>
            </h3>
            <dl className={s.facts}>
              {p.facts.map((f, i) => (
                <div key={i}>
                  <dt>{f.label}：</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className={s.work}>
            <h3 className={s.sectionTitle}>
              工作经历 <span>Work experience</span>
            </h3>
            <div className={s.job}>
              <h4>
                {p.company} 丨 {p.role}
              </h4>
              <span>{p.period}</span>
            </div>
            <p className={s.summary}>{p.summary}</p>
            <ol className={s.achievements}>
              {p.achievements.map((a, i) => (
                <li key={i}>
                  <strong>{a.title}：</strong>
                  {a.description}
                </li>
              ))}
            </ol>
          </section>
          <div className={s.bottom}>
            <section>
              <h3 className={s.inlineTitle}>
                教育经历 <span>Education</span>
              </h3>
              <ul className={s.education}>
                {p.education.map((e, i) => (
                  <li key={i}>
                    <span>
                      {e.school}
                      <sup>（{e.qualification}）</sup>
                    </span>
                    <span>{e.major}</span>
                    <span>{e.period}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className={s.inlineTitle}>
                技能 <span>skills</span>
              </h3>
              <ul className={s.skills}>
                {p.skills.map((v, i) => (
                  <li key={i}>{v.label}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}
