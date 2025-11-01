export type apiResponse = {
    data: formDataDto | null;
    success: boolean;
    code: string;
    description: string;
}

export type formDataDto = {
    name : string;
    description : string;
    nameOption : number;
    organizationLogo?: string;
    language : Language;
    questions : questionDto[];
}

export enum Language {
    En = 1,
    Ar = 2
}

export type questionDto = {
    id : number;
    question : string;
    subQuestions : subQuestionDto[] | null;
    choices : ChoiceDto[] | null;
    type : QuestionTypeEnum;
    isRequired : boolean;
    hints?: {
        hint: string;
        type: string;
    }[];
    minimumSelectedAnswers?: number | null;
    maximumSelectedAnswers?: number | null;
}

export type subQuestionDto = {
    id : number;
    title : string;
}

export type ChoiceDto = {
    id : number;
    name : string;
}

// add enum 
export enum QuestionTypeEnum {
    MultipleChoice = 1,
    OpenText = 2,
    FileUpload = 3,
    SelectMultiple = 4,
    BeforeAndAfterChoice = 5,
    BeforeAndAfterValue = 6,
    IndicatorImprovement = 7
}


// submit From Dtos 

export type SubmitFormDto = {
    participantName: string | null;
    startedAt: Date | null;
    latitude: number | null;
    longitude: number | null;
    questionsAnswers: questionAnswerDto[];
}

export type questionAnswerDto = {
    questionId : number;
    answer : string | null;
    multipleChoiceQuestions : multipleChoiceQuestionAnswerDto[] | null;
    selectMultipleQuestions : selectMultipleQuestionAnswerDto[] | null;
    uploadFileQuestions : uploadFileQuestions | null;
    beforeAndAfterChoiceQuestions: beforeAndAfterChoiceQuestionAnswerDto[] | null;
    beforeAndAfterValueQuestions : beforeAndAfterValueQuestionAnswerDto[] | null;
    indicatorImprovement?: {
        beforeValue: number;
        afterValue: number;
    };
}

export type multipleChoiceQuestionAnswerDto = {
    subQuestionId : number;
    optionId : number;
}

export type uploadFileQuestions = {
    files : File[];
    filesIds : number[];
}

export type selectMultipleQuestionAnswerDto = {
    subQuestionId : number;
    optionIds : number[];
}

export type beforeAndAfterChoiceQuestionAnswerDto = {
    subQuestionId : number;
    beforeOptionId : number;
    afterOptionId : number;
}

export type beforeAndAfterValueQuestionAnswerDto = {
    subQuestionId : number;
    beforeValue : number | null;
    afterValue : number | null;
}