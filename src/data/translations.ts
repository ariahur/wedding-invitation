import { Language } from '../types/language';

export interface TimelineEvent {
  title: string;
  description: string;
  image?: string;
}

export interface Translations {
  loading: {
    message: string;
  };
  timeline: {
    title: string;
    events: TimelineEvent[];
  };
  hero: {
    topTitle: string;
    date: string;
    time: string;
    airline: string;
    tagline: string;
    class: string;
    flight: string;
    origin: {
      code: string;
      city: string;
      cityKo: string;
    };
    destination: {
      code: string;
      city: string;
      cityKo: string;
    };
    groom: {
      name: string;
      nameEn: string;
      parents: {
        father: string;
        mother: string;
      };
      relationship: string;
    };
    bride: {
      name: string;
      nameEn: string;
      parents: {
        father: string;
        mother: string;
      };
      relationship: string;
    };
    invitationTitle: string;
    message: string;
    details: {
      date: string;
      time: string;
      venue: string;
      address: string;
      floor: string;
    };
    footer: {
      gate: string;
      boarding: string;
    };
    barcode: string;
  };
  directions: {
    title: string;
    subway: {
      title: string;
      line1: string;
      note1: string;
      note2: string;
    };
    bus: {
      title: string;
      main: string;
      branch: string;
      express: string;
    };
    car: {
      title: string;
      address: string;
      navigation: string;
      parking: string;
    };
    venue: string;
    address: string;
    floor: string;
    tel: string;
    copyButton: string;
    copiedButton: string;
  };
  rsvp: {
    title: string;
    intro: string;
    thankYouMessage: string;
    seatingMessage: string;
      form: {
        name: string;
        phone: string;
        phonePlaceholder: string;
        email: string;
        emailOptional: string;
        attendance: string;
        attending: string;
        notAttending: string;
        guestCount: string;
        guestCountHint: string;
        note: string;
        notePlaceholder: string;
        submit: string;
        submitting: string;
        success: string;
        error: string;
      };
    footer: {
      inquiry: string;
      groom: string;
      bride: string;
    };
  };
}

export const translations: Record<Language, Translations> = {
  ko: {
    loading: {
      message: "We're getting married.",
    },
    timeline: {
      title: '함께한 시간',
      events: [
        {
          title: '첫만남',
          description: '저희는 대학교에서\n처음 만났어요.',
          image: '/timeline/first-meeting.jpg',
        },
        {
          title: '5주년', // 2018
          description: '스무 살의 시작부터\n20대의 청춘을 함께 보냈어요.',
          image: '/timeline/5th-anniversary.jpg',
        },
        {
          title: '갑자기 찾아온 장거리',
          description: '2019년 1월,\n우리는 장거리 연애를 시작했어요.\n떨어져 있어도 마음만은 늘 가까웠어요.',
          image: '/timeline/long-distance.jpg',
        },
        {
          title: '10주년',
          description: '다시 같은 곳에서,\n우리는 재회를 넘어\n결혼을 결심했어요.',
          image: '/timeline/10th-anniversary.jpg',
        },
        {
          title: 'Wedding Day',
          description: '이제 부부로서\n새로운 시작을 합니다.\n저희의 하루를 함께 축하해주세요.',
          image: '/timeline/wedding-day.jpg',
        },
      ],
    },
    hero: {
      topTitle: 'WEDDING BOARDING PASS',
      date: '2027.02.20',
      time: '15:00',
      airline: 'NO RETURN AIRLINES',
      tagline: 'Forever Together',
      class: 'FIRST',
      flight: 'Flight',
      origin: {
        code: 'SYD',
        city: 'Sydney',
        cityKo: '시드니',
      },
      destination: {
        code: 'ICN',
        city: 'Seoul',
        cityKo: '서울',
      },
      groom: {
        name: '조준용',
        nameEn: 'Daniel',
        parents: {
          father: '조웅일',
          mother: '김미정',
        },
        relationship: '장남',
      },
      bride: {
        name: '허다영',
        nameEn: 'Aria',
        parents: {
          father: '허윤',
          mother: '황영식',
        },
        relationship: '장녀',
      },
      invitationTitle: '소중한 분들을 초대합니다.',
      message: '시드니에서 시작된 인연이\n이제 서울에서 아름다운 열매를 맺습니다.\n사랑하는 사람과의 새로운 여행을 시작하려 합니다.\n저희의 첫 비행에 함께하여 주시면 큰 기쁨이 되겠습니다.',
      details: {
        date: '날짜 DATE',
        time: '시간 TIME',
        venue: '장소 VENUE',
        address: '서울시 강남구 역삼로 607(대치동)',
        floor: '1층 플로리아',
      },
      footer: {
        gate: 'GATE 1F',
        boarding: 'BOARDING 15:00',
      },
      barcode: '<WEDDING2027022014KJ08PS>',
    },
    directions: {
      title: '오시는 길',
      subway: {
        title: '지하철',
        line1: '2호선 삼성역 1번 출구',
        note1: '1번 출구인 경우 셔틀버스가 대기',
        note2: '2번 출구인 경우 도보로 5분 소요',
      },
      bus: {
        title: '버스',
        main: '간선',
        branch: '지선',
        express: '광역',
      },
      car: {
        title: '자가용',
        address: '서울특별시 강남구 대치동 1004-3 네비게이션 검색 시 입구 안내',
        navigation: '',
        parking: '건물 주차타워 주차 가능 (3시간 무료)',
      },
      venue: '그랜드힐컨벤션',
      address: '서울시 강남구 역삼로 607(대치동)',
      floor: '1층 플로리아',
      tel: 'Tel. 02-6964-7889',
      copyButton: '주소 복사',
      copiedButton: '✓ 복사됨',
    },
    rsvp: {
      title: '참석 여부 전달하기',
      intro: '참석 여부를 알려주시면 소중히 준비하겠습니다',
      thankYouMessage: '소중한 시간을 내어 참석해주시는 분들께 진심으로 감사드립니다.',
      seatingMessage: '예식이 지정좌석제로 진행되어 참석 여부를 10월 1일까지 회신해주시면 감사하겠습니다.',
      form: {
        name: '성함',
        phone: '연락처',
        phonePlaceholder: '010-0000-0000',
        email: '이메일',
        emailOptional: '(선택)',
        attendance: '참석 여부',
        attending: '참석합니다',
        notAttending: '참석이 어렵습니다',
        guestCount: '동행 인원 (본인 포함)',
        guestCountHint: '최소 1명, 최대 10명',
        note: '요청사항',
        notePlaceholder: '음식 알러지, 휠체어 필요 등 요청사항을 입력해주세요',
        submit: '❤️ RSVP 제출하기',
        submitting: '제출 중...',
        success: '제출이 완료되었습니다',
        error: '제출 중 오류가 발생했습니다. 다시 시도해주세요.',
      },
      footer: {
        inquiry: '문의',
        groom: '신랑 010-1234-5678',
        bride: '신부 010-9876-5432',
      },
    },
  },
  en: {
    loading: {
      message: "We're getting married",
    },
    timeline: {
      title: 'Time Together',
      events: [
        {
          title: 'First Meeting',
          description: 'We first met at university.',
          image: '/timeline/first-meeting.jpg',
        },
        {
          title: '5th Anniversary',
          description: 'We spent our youth together from the age of 20.',
          image: '/timeline/5th-anniversary.jpg',
        },
        {
          title: 'Long Distance Begins',
          description: 'In January 2019, we started a long distance relationship. Even though we were apart, our hearts were always close.',
          image: '/timeline/long-distance.jpg',
        },
        {
          title: '10th Anniversary',
          description: 'Back in the same place, we decided to get married, going beyond just reuniting.',
          image: '/timeline/10th-anniversary.jpg',
        },
        {
          title: 'Wedding Day',
          description: 'Now we begin a new chapter as husband and wife. Please celebrate our special day with us.',
          image: '/timeline/wedding-day.jpg',
        },
      ],
    },
    hero: {
      topTitle: 'WEDDING BOARDING PASS',
      date: '2027.02.20',
      time: '15:00',
      airline: 'NO RETURN AIRLINES',
      tagline: 'Forever Together',
      class: 'FIRST',
      flight: 'Flight',
      origin: {
        code: 'SYD',
        city: 'Sydney',
        cityKo: 'Sydney',
      },
      destination: {
        code: 'ICN',
        city: 'Seoul',
        cityKo: 'Seoul',
      },
      groom: {
        name: 'Daniel',
        nameEn: 'Daniel',
        parents: {
          father: 'Cho Woong-il',
          mother: 'Kim Mi-jeong',
        },
        relationship: 'eldest son',
      },
      bride: {
        name: 'Aria',
        nameEn: 'Aria',
        parents: {
          father: 'Hur Yoon',
          mother: 'Hwang Young-sik',
        },
        relationship: 'eldest daughter',
      },
      invitationTitle: 'We invite our precious guests.',
      message: 'A journey that began in Sydney\nnow bears beautiful fruit in Seoul.\nWe are about to begin a new journey with the one we love.\nIt would be a great joy to have you join us on our first flight together.',
      details: {
        date: 'DATE',
        time: 'TIME',
        venue: 'VENUE',
        address: '607 Yeoksam-ro, Gangnam-gu, Seoul (Daechi-dong)',
        floor: '1F Floria',
      },
      footer: {
        gate: 'GATE 1F',
        boarding: 'BOARDING 15:00',
      },
      barcode: '<WEDDING2027022014KJ08PS>',
    },
    directions: {
      title: 'Directions',
      subway: {
        title: 'Subway',
        line1: 'Line 2, Samsung Station, Exit 1',
        note1: 'Shuttle bus available at Exit 1',
        note2: '5 minutes walk from Exit 2',
      },
      bus: {
        title: 'Bus',
        main: 'Main',
        branch: 'Branch',
        express: 'Express',
      },
      car: {
        title: 'Car',
        address: '1004-3 Daechi-dong, Gangnam-gu, Seoul (Navigation: search for entrance)',
        navigation: '',
        parking: 'Building parking tower available (3 hours free)',
      },
      venue: 'Grand Hill Convention',
      address: '607 Yeoksam-ro, Gangnam-gu, Seoul (Daechi-dong)',
      floor: '1F Floria',
      tel: 'Tel. 02-6964-7889',
      copyButton: 'Copy Address',
      copiedButton: '✓ Copied',
    },
    rsvp: {
      title: 'RSVP',
      intro: 'Please let us know if you will be attending so we can prepare accordingly',
      thankYouMessage: 'We sincerely thank those who take the time to attend our special day.',
      seatingMessage: 'As the ceremony will be held with assigned seating, we would appreciate your RSVP by October 1st.',
      form: {
        name: 'Name',
        phone: 'Phone',
        phonePlaceholder: '0400-000-000',
        email: 'Email',
        emailOptional: '(Optional)',
        attendance: 'Attendance',
        attending: 'I will attend',
        notAttending: 'I cannot attend',
        guestCount: 'Number of Guests (including yourself)',
        guestCountHint: 'Minimum 1, Maximum 10',
        note: 'Special Requests',
        notePlaceholder: 'Please enter any requests such as food allergies, wheelchair needs, etc.',
        submit: '❤️ Submit RSVP',
        submitting: 'Submitting...',
        success: 'Your RSVP has been submitted successfully',
        error: 'An error occurred while submitting. Please try again.',
      },
      footer: {
        inquiry: 'Inquiries',
        groom: 'Groom 010-1234-5678',
        bride: 'Bride 010-9876-5432',
      },
    },
  },
};

