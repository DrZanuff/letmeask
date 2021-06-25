import { useHistory, useParams } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import {Button} from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
//import { useAuth } from '../hooks/useAuths';
import { useRoom } from '../hooks/useRoom';
import '../styles/room.scss';
import { database } from '../services/firebase';
import { SvgIcon } from '../components/svg_icons/Icon';


type RoomParams = {
    id : string;
}

export function AdminRoom(){
    //const {user} = useAuth();
    const history = useHistory();
    const params = useParams<RoomParams>();
    const roomId = params.id;

    const { title , questions } = useRoom(roomId);

    async function handleEndRoom() {
        database.ref(`rooms/${roomId}/`).update({
            endedAt: new Date(),
        })

        history.push('/');
        
    }

    async function handleDeleteQuestion(questionId : string){
        if  ( window.confirm('Tem certeza que deseja excluir essa pergunta?') ){
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        }
    }

    async function handleCheckQuestionAsAnswered(questionId:string,questionIsAnswered:boolean) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: !questionIsAnswered,
        })
    }

    async function handleHilightQuestion(questionId:string,questionIsHighlighted:boolean) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: !questionIsHighlighted,
        })
    }


    return(
        <div id='page-room'>
            <header>
                <div className='content'>
                    <img src={logoImg} alt='Letmesask'/>
                    <div>
                        <RoomCode code={roomId}></RoomCode>
                        <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className='room-title'>
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{questions.length} pergunta(s)</span> }
                </div>
                
                <div className="question-list">
                    {questions.map( question => {
                        return (
                            <Question
                                content={question.content}
                                author={question.author}
                                key={question.id}
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}
                            >
                                <button
                                    key={1}
                                    type='button'
                                    onClick={ ()=> handleCheckQuestionAsAnswered(question.id,question.isAnswered) }    
                                >
                                    <SvgIcon type='check' status={question.isAnswered} ></SvgIcon>
                                </button>

                                {!question.isAnswered && (
                                    [
                                    <button
                                        key={2}
                                        type='button'
                                        onClick={ ()=> handleHilightQuestion(question.id , question.isHighlighted) }    
                                    >
                                        <SvgIcon type='answer' status={question.isHighlighted} ></SvgIcon>
                                    </button>
                                    ]
                                )}

                                <button
                                    key={3}
                                    type='button'
                                    onClick={ ()=> handleDeleteQuestion(question.id) }    
                                >
                                    <img src={deleteImg} alt='Remover pergunta'></img>
                                </button>

                            </Question>
                        );
                    } )}
                </div>


            </main>

        </div>
    );
}