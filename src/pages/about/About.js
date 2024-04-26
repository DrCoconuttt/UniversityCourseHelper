import {BsGithub} from "react-icons/bs"

const About = () => {

    return(
        <div className = "about">
            <h1 className = "centerText">
                About
            </h1>
            <p>
            Universities offer a massive amount of courses. The information needed to make an informed decision on what courses
            to take can be a difficult and time consuming. Information such as which courses are required for a certain degrees, which 
            courses are pre requisites for future required courses, what the profs and syllabi past courses were and when certain courses are typically taught are spread across several
            different websites. In addition, some of these websites require are laid out in such a way where acquiring this information
            unescissarly requires visiting several pages. Without this information a student could find themselves missing a course required for their
            degree or missing a prerequisite or missing a course that is rarely offered, unnecessarily delaying their degree. 
            Another possibility is for a student to find themselves in a course with a professor whose teaching style they do no click with
            or a courses with requirements that are difficult to complete, such as enrolling several courses that have heavy group projects.
            Or a student could miss out on a course they would have enjoyed because it is so time consuming to learn about what a course entails.
            </p>

            <p>
            The University Course Helper solves this problem, allowing students to quickly and easily gather important
            information on courses they can take to make. Students can also rate courses and
            comment their thoughts or experiences courses, like Rate my Professor but with courses.
            The University Course Helper allows students to make an informed decision on which courses to take, without the hassle.
            </p>

            <div className="githubIconAlign">
                <a target="_blank" rel="noopener noreferrer" href="https://github.com/DrCoconuttt/UniversityCourseHelper" className="githubIcon" >
                        <BsGithub />
                </a>
            </div>
        </div>
    )
}

export default About