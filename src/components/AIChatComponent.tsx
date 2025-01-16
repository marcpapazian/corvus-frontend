import React, {useState} from "react";
import styled from "styled-components";
import {XMarkIcon, ClipboardDocumentCheckIcon, MagnifyingGlassCircleIcon} from "@heroicons/react/24/outline";
import {getChatCompletion} from "../services/api";

// New file probably

const TextBoxContainer = styled.div`
    display: flex;
    align-items: center;
    background-color: #f7f7f8;
`;

const InputWrapper = styled.div`
    position: relative;
    flex: 1;
`;

const Input = styled.textarea`
    width: 100%;
    padding: 10px;
    font-size: 16px;
    border: none;
    border-radius: 8px;
    resize: none;
    outline: none;
    background-color: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    min-height: 40px;
    max-height: 100px;

    &:focus {
        box-shadow: 0 0 0 2px #0078d4;
    }
`;

const SendButton = styled.button`
    position: absolute;
    right: 10px;
    bottom: 10px;
    width: 20px;
    height: 20px;
    font-size: 0;
    color: white;
    background-color: #0078d4;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    &:hover {
        background-color: #005ea1;
    }

    &:active {
        background-color: #004377;
    }
`;


const ChatTextBox = ({onSend}) => {
  const [value, setValue] = useState(''); // State to manage input value

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const handleSend = () => {
    if (value.trim()) {
      onSend(value); // Call the onSend function with the current value
      setValue('');  // Clear the input after sending
    }
  };

  return (
    <TextBoxContainer>
      <InputWrapper>
        <Input
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Ask anything..."
        />
        <SendButton onClick={handleSend}>
          Send
        </SendButton>
      </InputWrapper>
    </TextBoxContainer>
  );
};

export default ChatTextBox;

// New file probably
const ActionSuggestionsContainer = styled.div`
    margin-top: 5px;
    display: flex;
`

const ActionSuggestions = () => {
  return (
    <ActionSuggestionsContainer>
      <span
        className={`py-0.5 text-xs`}>Quick actions:</span>
      <span
        className={`px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 ml-1.5 cursor-pointer`}>Request surgical history</span>
      <span
        className={`px-2 py-0.5 text-xs rounded-full bg-purple-100 text-purple-700 ml-1.5 cursor-pointer`}>List similar patients</span>
    </ActionSuggestionsContainer>)
}

// New file probably

const ResponseContainer = styled.div`
    margin-top: 16px;
`

const ResponseCard = styled.div`
    padding: 16px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    display: flex;
    align-items: center; /* Vertically align children */
    min-height: 58px;
`;

const Icon = styled.div`
    display: flex;
    align-items: center; /* Center icon vertically within its container */
    justify-content: center;
    border-radius: 50%;
    width: 20px;
    height: 20px; /* Fixed height */
    margin-right: 8px; /* Add space between icon and text */
`;

const StatCard = styled.span`
    font-weight: bold;
`;

const CardText = styled.span`
    font-size: 14px;
`


const NoResponse = () => {
  return (
    <ResponseCard>
      <Icon>
        <XMarkIcon className="h-6 w-6"/>
      </Icon>
      <CardText>I'm afraid I can't help with that. Please ask something else.</CardText>
    </ResponseCard>
  )
}

const StatResponse = ({statText}: { statText: string }) => {
  return (
    <ResponseCard>
      <Icon>
        <ClipboardDocumentCheckIcon className="h-6 w-6"/>
      </Icon>
      <CardText>
        I found the stat you requested in the patient's case file: <StatCard>{statText}</StatCard>
      </CardText>
    </ResponseCard>
  )
}

const RequestResponse = () => {
  return (
    <ResponseCard>
      <Icon>
        <MagnifyingGlassCircleIcon className="h-6 w-6"/>
      </Icon>
      <CardText>We'll need to reach out to the patient to request that data. Would you like to initiate the request
        now?</CardText>
    </ResponseCard>
  )
}

const LoadingResponse = ({loadingPct}: { loadingPct: number }) => {
  return (
    <ResponseCard>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{width: `${loadingPct}%`}}
        ></div>
      </div>
    </ResponseCard>
  )
}


const Response = ({loading, loadingPct, responseType, responseStat}: {
  loading: boolean,
  loadingPct: number,
  responseType: ResponseType
  responseStat?: string
}) => {
  if (loading) {
    return (
      <ResponseContainer>
        <LoadingResponse loadingPct={loadingPct}/>
      </ResponseContainer>
    );
  }

  if (responseType === ResponseType.NO_RESPONSE) {
    return (
      <ResponseContainer>
        <NoResponse/>
      </ResponseContainer>
    );
  }

  if (responseType === ResponseType.STAT_RESPONSE) {
    return (
      <ResponseContainer>
        <StatResponse statText={responseStat}/>
      </ResponseContainer>
    );
  }

  if (responseType === ResponseType.REQUEST_RESPONSE) {
    return (
      <ResponseContainer>
        <RequestResponse/>
      </ResponseContainer>
    );
  }
};

// New file probably

const Description = styled.span`
    color: #6b7280;
    font-size: 14px;
    display: block;
    margin-bottom: 16px;
    margin-top: -12px;
`

enum ResponseType {
  NO_RESPONSE,
  STAT_RESPONSE,
  REQUEST_RESPONSE,
}

export const AIChat = () => {
  const [showResponse, setShowResponse] = React.useState<boolean>(false)
  const [responseLoading, setResponseLoading] = React.useState<boolean>(true)
  const [loadingPct, setLoadingPct] = React.useState<number>(0)
  const [responseType, setResponseType] = React.useState<ResponseType>(ResponseType.NO_RESPONSE)
  const [responseStat, setResponseStat] = React.useState<string>('')

  const handleSend = async (chat: string) => {
    setShowResponse(true)
    setResponseLoading(true)
    const rawResponse = await getChatCompletion(chat)
    const response = rawResponse.response;

    let responseType = ResponseType.NO_RESPONSE
    let statText = ''

    const type = response.type;
    if (type === 'STAT_RESPONSE') {
      console.log('Stat value:', response.statValue)
      responseType = ResponseType.STAT_RESPONSE
      statText = response.statValue;
    } else if (type === 'REQUEST_RESPONSE') {
      console.log('Request response')
      responseType = ResponseType.REQUEST_RESPONSE
    } else {
      console.log('Response rejected')
      responseType = ResponseType.NO_RESPONSE
    }

    if (chat.toLowerCase().includes('hemo')) {
      responseType = ResponseType.STAT_RESPONSE
    } else if (chat.toLowerCase().includes('diet')) {
      responseType = ResponseType.REQUEST_RESPONSE
    }

    setLoadingPct(0)
    const interval = setInterval(() => {
      setLoadingPct((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          setResponseLoading(false)
          setResponseType(responseType)
          setResponseStat(statText)
          return 0;
        }
        return prevProgress + 1;
      });
    }, 20); // Adjust the interval speed as needed
  }

  return (
    <>
      <Description>Ask the AI Assistant to for suggestions for next steps, to fetch more data about the patient, or to
        find similar historical cases.</Description>
      <ChatTextBox onSend={handleSend}/>
      <ActionSuggestions/>
      {showResponse && <Response loading={responseLoading} loadingPct={loadingPct} responseType={responseType}
                                 responseStat={responseStat}/>}
    </>
  )
}