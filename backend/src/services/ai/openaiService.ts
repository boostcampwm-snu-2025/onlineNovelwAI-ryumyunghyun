import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AIReviewRequest {
  chapterContent: string;
  chapterNumber: number;
  chapterTitle: string;
  previousChapters: Array<{
    chapterNumber: number;
    title: string;
    content: string;
  }>;
  personaType: string;
  personaName: string;
}

export interface AIReviewResponse {
  reviewText: string;
  rating: number;
}

export async function generateReview(request: AIReviewRequest): Promise<AIReviewResponse> {
  const systemPrompt = getSystemPrompt(
    request.personaType,
    request.personaName,
    request.previousChapters
  );

  const userPrompt = `
소설 제목: ${request.previousChapters.length > 0 ? '연재 소설' : '첫 챕터'}
챕터 번호: ${request.chapterNumber}
챕터 제목: ${request.chapterTitle}

챕터 내용:
${request.chapterContent}

위 챕터를 평가해주세요. 다음 형식으로 작성해주세요:

## 장점
[구체적인 장점 2-3개]

## 개선점
[구체적인 개선점 2-3개]

## 종합평가
[전체적인 평가와 격려]

평점: [1-10점]
`;

  try {
    // Determine model based on chapter length
    const model = request.chapterContent.length < 1000 ? 'gpt-3.5-turbo' : 'gpt-4';

    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    const reviewText = completion.choices[0].message.content || '';
    const rating = extractRating(reviewText);

    return {
      reviewText: reviewText.replace(/평점:.*$/m, '').trim(),
      rating
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('AI 리뷰 생성 중 오류가 발생했습니다');
  }
}

function getSystemPrompt(
  personaType: string,
  personaName: string,
  previousChapters: Array<{ chapterNumber: number; title: string; content: string }>
): string {
  let basePrompt = `당신은 "${personaName}"입니다. `;

  // Add persona-specific characteristics
  switch (personaType) {
    case 'casual-reader':
      basePrompt += `평범한 독자로서 재미와 몰입도를 중시합니다. 친근하고 솔직한 톤으로 평가하세요. 흥미도, 가독성, 공감도를 중점적으로 평가합니다.`;
      break;
    case 'literary-critic':
      basePrompt += `전문적인 문학 평론가로서 문학적 가치를 중시합니다. 격식있고 학술적인 톤으로 평가하세요. 문체, 주제의식, 서사 구조, 상징성을 중점적으로 평가합니다.`;
      break;
    case 'genre-enthusiast':
      basePrompt += `특정 장르의 열성 팬으로서 장르 문법과 독창성을 중시합니다. 열정적이고 비교 분석적인 톤으로 평가하세요. 장르 컨벤션, 클리셰 활용, 참신성을 중점적으로 평가합니다.`;
      break;
    case 'editor':
      basePrompt += `출판 편집자로서 실용적이고 객관적인 관점을 가집니다. 객관적이고 실무적인 톤으로 평가하세요. 맞춤법, 문법, 문장 구조, 가독성을 중점적으로 평가합니다.`;
      break;
    case 'commercial-publisher':
      basePrompt += `상업 출판인으로서 시장성과 상업적 잠재력을 중시합니다. 비즈니스적이고 전략적인 톤으로 평가하세요. 시장 트렌드, 상업성, 타겟 독자층을 중점적으로 평가합니다.`;
      break;
    case 'fellow-writer':
      basePrompt += `창작 작가 동료로서 공감적이고 격려하는 자세를 가집니다. 따뜻하고 지지적인 톤으로 평가하세요. 창작 과정, 작가의 의도, 기술적 도전을 중점적으로 평가합니다.`;
      break;
  }

  // Add context from previous chapters
  if (previousChapters.length > 0) {
    basePrompt += `\n\n이 소설의 이전 챕터들:\n`;
    previousChapters.forEach((chapter, index) => {
      const summary = chapter.content.substring(0, 200) + '...';
      basePrompt += `- 챕터 ${chapter.chapterNumber}: ${chapter.title} - ${summary}\n`;
    });
    basePrompt += `\n새로운 챕터를 평가할 때 이전 내용과의 일관성과 연결성을 고려해주세요.`;
  } else {
    basePrompt += `\n\n이것은 소설의 첫 챕터입니다. 첫인상과 독자를 끌어들이는 능력을 중점적으로 평가해주세요.`;
  }

  basePrompt += `\n\n반드시 구체적인 예시를 들어 평가하고, 긍정적 피드백과 개선점을 균형있게 제시해주세요. 평가는 한국어로 작성하며, 최소 200자 이상 작성해주세요.`;

  return basePrompt;
}

function extractRating(reviewText: string): number {
  const ratingMatch = reviewText.match(/평점:\s*(\d+)/);
  if (ratingMatch) {
    const rating = parseInt(ratingMatch[1]);
    return Math.min(Math.max(rating, 1), 10); // Ensure rating is between 1-10
  }
  return 7; // Default rating if not found
}
