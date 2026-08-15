import { Language } from "../types/language";

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
  gallery: {
    title: string;
    subtitle: string;
    photoLabel: string;
    prev: string;
    next: string;
    close: string;
  };
  hero: {
    topTitle: string;
    date: string;
    time: string;
    airline: string;
    class: string;
    flight: string;
    flightLabel: string;
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
      parents: {
        father: string;
        mother: string;
      };
      relationship: string;
    };
    bride: {
      name: string;
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
    flip: {
      toPass: string;
      toPhoto: string;
    };
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
      addressBeforeSearch: string;
      addressSearch: string;
      parking: string;
    };
    venue: string;
    address: string;
    floor: string;
    tel: string;
    copyButton: string;
    copiedButton: string;
  };
  aboutUs: {
    title: string;
    intro: string;
    introSubtitle: string;
    contactButton: string;
    contactModal: {
      title: string;
      titleKo: string;
      groom: {
        label: string;
        labels: {
          groom: string;
          father: string;
          mother: string;
        };
        groom: {
          name: string;
          phone: string;
          email: string;
        };
        father: {
          name: string;
          phone: string;
          email: string;
        };
        mother: {
          name: string;
          phone: string;
          email: string;
        };
      };
      bride: {
        label: string;
        labels: {
          bride: string;
          father: string;
          mother: string;
        };
        bride: {
          name: string;
          phone: string;
          email: string;
        };
        father: {
          name: string;
          phone: string;
          email: string;
        };
        mother: {
          name: string;
          phone: string;
          email: string;
        };
      };
    };
    groom: {
      name: string;
      nameLabel: string;
      keyword: string;
      parents: {
        father: string;
        mother: string;
      };
      birth: string;
      description: string;
      emoji: string;
      image?: string;
    };
    bride: {
      name: string;
      nameLabel: string;
      keyword: string;
      parents: {
        father: string;
        mother: string;
      };
      birth: string;
      description: string;
      emoji: string;
      image?: string;
    };
  };
  rsvp: {
    title: string;
    intro: string;
    lookup: {
      bannerLabel: string;
      bannerTitle: string;
      bannerButton: string;
      editingLabel: string;
      editingTitle: string;
      editingButton: string;
      modalLabel: string;
      modalTitle: string;
      namePlaceholder: string;
      phonePlaceholder: string;
      hint: string;
      submit: string;
      submitting: string;
      notFound: string;
      error: string;
      close: string;
    };
    ticket: {
      label: string;
      status: string;
      passenger: string;
      passengerSuffix: string;
      seats: string;
      date: string;
      boarding: string;
      gate: string;
      classLabel: string;
      dateValue: string;
      boardingValue: string;
      gateValue: string;
      classValue: string;
      issuedMessage: string;
      savedMessage: string;
      editButton: string;
      absent: {
        label: string;
        title: string;
        message: string;
        footer: string;
      };
      /** 발급 완료 손님에게 RSVP 섹션에 남기는 안내 */
      panel: {
        label: string;
        issuedTitle: string;
        savedTitle: string;
        absentTitle: string;
        message: string;
        viewButton: string;
      };
    };
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
      hasChildren: string;
      hasChildrenNo: string;
      hasChildrenYes: string;
      childrenAges: string;
      childrenAgesPlaceholder: string;
      note: string;
      notePlaceholder: string;
      submit: string;
      submitNotAttending: string;
      submitting: string;
      success: string;
      error: string;
    };
  };
  thankYou: {
    message: string;
  };
}

export const translations: Record<Language, Translations> = {
  ko: {
    loading: {
      message: "We're getting married!",
    },
    gallery: {
      title: "우리의 순간",
      subtitle: "사진을 탭하면 크게 보실 수 있어요",
      photoLabel: "웨딩 사진",
      prev: "이전 사진",
      next: "다음 사진",
      close: "닫기",
    },
    timeline: {
      title: "함께한 시간",
      events: [
        {
          title: "첫만남",
          description: "저희는 대학교에서\n처음 만났어요.",
          image: "timeline/2013",
        },
        {
          title: "5주년",
          description: "스무 살의 시작부터\n20대의 청춘을 함께 보냈어요.",
          image: "timeline/2018",
        },
        {
          title: "장거리 시작",
          description:
            "2019년 1월,\n우리는 장거리 연애를 시작했어요.\n떨어져 있어도 마음만은 늘 가까웠어요.",
          image: "timeline/2019",
        },
        {
          title: "10주년",
          description:
            "다시 같은 곳에서,\n우리는 재회를 넘어\n결혼을 결심했어요.",
          image: "timeline/2025",
        },
        {
          title: "Wedding Day",
          description:
            "이제 부부로서\n새로운 시작을 합니다.\n저희의 하루를 함께 축하해주세요.",
          image: "timeline/2027",
        },
      ],
    },
    hero: {
      topTitle: "WEDDING BOARDING PASS",
      date: "2027.02.20",
      time: "15:00",
      airline: "NO RETURN AIRLINES",
      class: "VVIP",
      flight: "DA206",
      flightLabel: "Flight no.",
      origin: {
        code: "SYD",
        city: "Sydney",
        cityKo: "시드니",
      },
      destination: {
        code: "ICN",
        city: "Seoul",
        cityKo: "서울",
      },
      groom: {
        name: "조준용",
        parents: {
          father: "조웅일",
          mother: "김미정",
        },
        relationship: "장남",
      },
      bride: {
        name: "허다영",
        parents: {
          father: "허윤",
          mother: "황영식",
        },
        relationship: "장녀",
      },
      invitationTitle: "소중한 분들을 초대합니다.",
      message:
        "시드니에서 시작된 인연이\n이제 서울에서 아름다운 열매를 맺습니다.\n사랑하는 사람과의 새로운 여행을 시작하려 합니다.\n저희의 첫 비행에 함께하여 주시면 큰 기쁨이 되겠습니다.",
      details: {
        date: "날짜 DATE",
        time: "시간 TIME",
        venue: "장소 VENUE",
        address: "서울시 강남구 역삼로 607(대치동)",
        floor: "1층 플로리아",
      },
      footer: {
        gate: "GATE 1F",
        boarding: "BOARDING 15:00",
      },
      barcode: "<WEDDING2027022014KJ08PS>",
      flip: {
        toPass: "탑승권 보기",
        toPhoto: "사진 보기",
      },
    },
    directions: {
      title: "오시는 길",
      subway: {
        title: "지하철",
        line1: "2호선 삼성역",
        note1: "1번 출구인 경우 셔틀버스가 대기",
        note2: "2번 출구인 경우 도보로 5분 소요",
      },
      bus: {
        title: "버스",
        main: "간선",
        branch: "지선",
        express: "광역",
      },
      car: {
        title: "자가용",
        addressBeforeSearch: "내비게이션: '서울특별시 강남구 대치동 1004-3' ",
        addressSearch: "검색",
        parking: "건물 주차타워 주차 가능 (3시간 무료)",
      },
      venue: "그랜드힐컨벤션",
      address: "서울시 강남구 역삼로 607(대치동)",
      floor: "1층 플로리아",
      tel: "Tel. 02-6964-7889",
      copyButton: "주소 복사",
      copiedButton: "✓ 복사됨",
    },
    aboutUs: {
      title: "오늘의 비행 안내",
      intro: "저희 커플을 소개합니다",
      introSubtitle:
        "꿈을 향해 나아가는 사람과,\n지금을 성실히 살아가는 사람이 만나\n이 비행은 시작되었습니다.",
      contactButton: "축하 연락하기",
      contactModal: {
        title: "CONTACT",
        titleKo: "연락하기",
        groom: {
          label: "신랑측",
          labels: {
            groom: "신랑",
            father: "신랑 아버지",
            mother: "신랑 어머니",
          },
          groom: {
            name: "조준용",
            phone: "+61-0430-135-117",
            email: "groom@example.com",
          },
          father: {
            name: "조웅일",
            phone: "+61-0430-185-337",
            email: "groom.father@example.com",
          },
          mother: {
            name: "김미정",
            phone: "+61-0411-363-054",
            email: "groom.mother@example.com",
          },
        },
        bride: {
          label: "신부측",
          labels: {
            bride: "신부",
            father: "신부 아버지",
            mother: "신부 어머니",
          },
          bride: {
            name: "허다영",
            phone: "+82-010-4015-8986",
            email: "bride@example.com",
          },
          father: {
            name: "허윤",
            phone: "+82-010-3735-0100",
            email: "bride.father@example.com",
          },
          mother: {
            name: "황영식",
            phone: "+82-010-3118-8986",
            email: "bride.mother@example.com",
          },
        },
      },
      groom: {
        name: "조준용",
        nameLabel: "신랑",
        keyword: "Dreamer",
        parents: {
          father: "조웅일",
          mother: "김미정",
        },
        birth: "1995년 6월 광주 출생",
        description:
          "사람들 속에서 에너지를 얻고,\n상상하는 일을 즐기는 사람.\n늘 목표를 세우며\n다음 여정을 꿈꿔왔습니다.",
        emoji: "🌍",
        image: "about/groom",
      },
      bride: {
        name: "허다영",
        nameLabel: "신부",
        keyword: "Navigator",
        parents: {
          father: "허윤",
          mother: "황영식",
        },
        birth: "1992년 12월 서울 출생",
        description:
          "지금의 삶을 차분히 바라보고\n하루하루를 성실히 살아온 사람.\n흔들리는 순간에도 방향을 잃지 않고\n오늘의 여정을 안전하게 이끌어왔습니다.",
        emoji: "🏠",
        image: "about/bride",
      },
    },
    rsvp: {
      title: "탑승권 신청",
      intro:
        "참석 여부를 알려주시면 소중히 준비하겠습니다\n예식이 지정좌석제로 진행되어 참석 여부를\n1월 10일까지 회신해주시면 감사하겠습니다.",
      lookup: {
        bannerLabel: "ALREADY CHECKED IN",
        bannerTitle: "이미 신청하셨나요?",
        bannerButton: "탑승권 조회",
        editingLabel: "EDIT BOARDING PASS",
        editingTitle: "신청 내용을 수정하고 있어요",
        editingButton: "탑승권 보기",
        modalLabel: "RETRIEVE BOARDING PASS",
        modalTitle: "신청하신 정보로 조회해 주세요",
        namePlaceholder: "성함",
        phonePlaceholder: "연락처 뒤 4자리",
        hint: "조회하시면 이 기기에 저장되어\n다음부터는 바로 탑승권이 보여요.",
        submit: "조회하기",
        submitting: "조회 중...",
        notFound:
          "신청 내역을 찾을 수 없어요.\n성함과 연락처를 다시 확인해 주세요.",
        error: "조회 중 오류가 발생했습니다. 다시 시도해주세요.",
        close: "닫기",
      },
      ticket: {
        label: "BOARDING PASS",
        status: "CONFIRMED",
        passenger: "PASSENGER",
        passengerSuffix: "외 {count}명",
        seats: "SEATS",
        date: "DATE",
        boarding: "BOARDING",
        gate: "GATE",
        classLabel: "CLASS",
        dateValue: "20 FEB 2027",
        boardingValue: "15:00",
        gateValue: "1F",
        classValue: "GUEST",
        issuedMessage:
          "탑승권이 발급되었습니다.\n당일 게이트에서 반갑게 맞이하겠습니다.",
        savedMessage:
          "이미 발급된 탑승권이에요.\n당일 게이트에서 반갑게 맞이하겠습니다.",
        editButton: "신청 내용 다시 작성하기",
        absent: {
          label: "NEXT FLIGHT · OPEN TICKET",
          title: "{name}님의 자리는\n비워 두겠습니다",
          message:
            "함께하지 못해 아쉽지만\n마음 보내주셔서 감사합니다.\n다음 비행에서 꼭 뵙기를 바랍니다.",
          footer: "VALID ANYTIME · NO EXPIRY",
        },
        panel: {
          label: "BOARDING PASS ISSUED",
          issuedTitle: "탑승권이 발급되었습니다",
          savedTitle: "이미 발급된 탑승권이 있어요",
          absentTitle: "다음 비행을 기약할게요",
          message:
            "청첩장 맨 위 사진을 누르면\n언제든 탑승권을 확인하실 수 있어요.",
          viewButton: "탑승권 보러 가기",
        },
      },
      form: {
        name: "성함",
        phone: "연락처",
        phonePlaceholder: "010-0000-0000",
        email: "이메일",
        emailOptional: "(선택)",
        attendance: "참석 여부",
        attending: "참석합니다",
        notAttending: "참석이 어렵습니다",
        guestCount: "동행 인원",
        guestCountHint:
          "좌석 배치를 위해 참석하시는 모든 분(영유아 포함)을 인원수에 포함해주세요.\n식사는 만 2세 이상부터 제공됩니다.",
        hasChildren: "어린이 또는 영유아가 함께 참석하나요?",
        hasChildrenNo: "아니오",
        hasChildrenYes: "예",
        childrenAges: "나이(개월/세)를 적어주세요:",
        childrenAgesPlaceholder: "예: 6개월, 2세, 5세",
        note: "전달사항",
        notePlaceholder:
          "음식 알러지 등 알려주실 사항이나 저희에게 전달하고 싶은 말씀이 있으시면 남겨주세요",
        submit: "탑승권 발급 받기",
        submitNotAttending: "다음 비행을 기약할게요 ✈️",
        submitting: "제출 중...",
        success: "탑승권 신청이 완료되었습니다.",
        error: "제출 중 오류가 발생했습니다. 다시 시도해주세요.",
      },
    },
    thankYou: {
      message:
        "이 비행의 기록은,\n시간이 흐르며 조금씩 채워질 예정입니다.\n함께해 주셔서 감사합니다.",
    },
  },
  en: {
    loading: {
      message: "We're getting married!",
    },
    gallery: {
      title: "Our Moments",
      subtitle: "Tap a photo to view it larger",
      photoLabel: "Wedding photo",
      prev: "Previous photo",
      next: "Next photo",
      close: "Close",
    },
    timeline: {
      title: "Time Together",
      events: [
        {
          title: "First Meeting",
          description: "We first met at university.",
          image: "timeline/2013",
        },
        {
          title: "Five Years Together",
          description:
            "From the beginning of our twenties,\nwe shared many days and grew together.",
          image: "timeline/2018",
        },
        {
          title: "Long Distance",
          description:
            "Then, in January 2019, distance unexpectedly became part of our journey,\nbut we stayed close in the ways that mattered.",
          image: "timeline/2019",
        },
        {
          title: "Ten Years Later",
          description:
            "After many turns and a few tears,\nwe chose to spend our lives together.",
          image: "timeline/2025",
        },
        {
          title: "Wedding Day",
          description:
            "Now, as husband and wife, we begin a new journey.\nPlease join us in celebrating our first steps together.",
          image: "timeline/2027",
        },
      ],
    },
    hero: {
      topTitle: "WEDDING BOARDING PASS",
      date: "20.02.2027",
      time: "15:00",
      airline: "NO RETURN AIRLINES",
      class: "VVIP",
      flight: "DA206",
      flightLabel: "Flight no.",
      origin: {
        code: "SYD",
        city: "Sydney",
        cityKo: "Sydney",
      },
      destination: {
        code: "ICN",
        city: "Seoul",
        cityKo: "Seoul",
      },
      groom: {
        name: "Daniel Cho",
        parents: {
          father: "Wung Il Jo",
          mother: "Mi Jeong Kim",
        },
        relationship: "eldest son",
      },
      bride: {
        name: "Aria Hur",
        parents: {
          father: "Yoon Hur",
          mother: "Young Sik Hwang",
        },
        relationship: "eldest daughter",
      },
      invitationTitle: "To Our Dearest People.",
      message:
        "A connection that began in Sydney\nnow bears beautiful fruit in Seoul.\nAs we begin a new journey\nwith the one we love,\nwe would be honoured to have you join us\non our first flight.",
      details: {
        date: "DATE",
        time: "TIME",
        venue: "VENUE",
        address: "607 Yeoksam-ro, Gangnam-gu,\nSeoul (Daechi-dong)",
        floor: "1F Floria",
      },
      footer: {
        gate: "GATE 1F",
        boarding: "BOARDING 15:00",
      },
      barcode: "<WEDDING2027022014KJ08PS>",
      flip: {
        toPass: "View boarding pass",
        toPhoto: "View photo",
      },
    },
    directions: {
      title: "Directions",
      subway: {
        title: "Subway",
        line1: "Line 2, Samsung Station",
        note1: "Shuttle bus available at Exit 1",
        note2: "5 minutes walk from Exit 2",
      },
      bus: {
        title: "Bus",
        main: "Main",
        branch: "Branch",
        express: "Express",
      },
      car: {
        title: "Car",
        addressBeforeSearch: "Navigation: ",
        addressSearch: "search '1004-3 Daechi-dong, Gangnam-gu, Seoul'",
        parking: "Building parking tower available (3 hours free)",
      },
      venue: "Grand Hill Convention",
      address: "607 Yeoksam-ro, Gangnam-gu, Seoul (Daechi-dong)",
      floor: "1F Floria",
      tel: "Tel. 02-6964-7889",
      copyButton: "Copy Address",
      copiedButton: "✓ Copied",
    },
    aboutUs: {
      title: "Flight Briefing",
      intro: "Introducing our couple",
      introSubtitle:
        "When one dreams of the future,\nand the other lives each day with care,\nthis flight begins.",
      contactButton: "Contact Us",
      contactModal: {
        title: "CONTACT",
        titleKo: "Contact",
        groom: {
          label: "GROOM",
          labels: {
            groom: "Groom",
            father: "Groom's Father",
            mother: "Groom's Mother",
          },
          groom: {
            name: "Daniel Cho",
            phone: "+61-0430-135-117",
            email: "groom@example.com",
          },
          father: {
            name: "Wung Il Jo",
            phone: "+61-0430-185-337",
            email: "groom.father@example.com",
          },
          mother: {
            name: "Mi Jeong Kim",
            phone: "+61-0411-363-054",
            email: "groom.mother@example.com",
          },
        },
        bride: {
          label: "BRIDE",
          labels: {
            bride: "Bride",
            father: "Bride's Father",
            mother: "Bride's Mother",
          },
          bride: {
            name: "Aria Hur",
            phone: "+82-010-4015-8986",
            email: "bride@example.com",
          },
          father: {
            name: "Yoon Hur",
            phone: "+82-010-3735-0100",
            email: "bride.father@example.com",
          },
          mother: {
            name: "Young Sik Hwang",
            phone: "+82-010-3118-8986",
            email: "bride.mother@example.com",
          },
        },
      },
      groom: {
        name: "Daniel Cho",
        nameLabel: "Groom",
        keyword: "Dreamer",
        parents: {
          father: "Wung Il Jo",
          mother: "Mi Jeong Kim",
        },
        birth: "Born in Gwangju, June 1995",
        description:
          "Finding energy among people,\nand joy in imagination.\nAlways setting goals,\ndreaming of the next journey.",
        emoji: "🌍",
        image: "about/groom",
      },
      bride: {
        name: "Aria Hur",
        nameLabel: "Bride",
        keyword: "Navigator",
        parents: {
          father: "Yoon Hur",
          mother: "Young Sik Hwang",
        },
        birth: "Born in Seoul, December 1992",
        description:
          "Someone who looks at life with calm and clarity,\nand lives each day with sincerity.\nEven in unsteady moments,\nalways guiding today's journey with care.",
        emoji: "🏠",
        image: "about/bride",
      },
    },
    rsvp: {
      title: "boarding pass rsvp",
      intro:
        "We sincerely thank you for taking the time\nto complete the form below.\nAs the ceremony will be held with assigned seating,\nwe would appreciate your RSVP by January 10th.",
      lookup: {
        bannerLabel: "ALREADY CHECKED IN",
        bannerTitle: "Already sent your RSVP?",
        bannerButton: "Find My Pass",
        editingLabel: "EDIT BOARDING PASS",
        editingTitle: "You are editing your RSVP",
        editingButton: "View my pass",
        modalLabel: "RETRIEVE BOARDING PASS",
        modalTitle: "Please enter the details you submitted",
        namePlaceholder: "Full name",
        phonePlaceholder: "Last 3 digits",
        hint: "Once found, it will be saved on this device\nso your pass appears right away next time.",
        submit: "Retrieve",
        submitting: "Searching...",
        notFound:
          "We could not find your RSVP.\nPlease check your name and phone number.",
        error: "An error occurred while searching. Please try again.",
        close: "Close",
      },
      ticket: {
        label: "BOARDING PASS",
        status: "CONFIRMED",
        passenger: "PASSENGER",
        passengerSuffix: "+{count} guest(s)",
        seats: "SEATS",
        date: "DATE",
        boarding: "BOARDING",
        gate: "GATE",
        classLabel: "CLASS",
        dateValue: "20 FEB 2027",
        boardingValue: "15:00",
        gateValue: "1F",
        classValue: "GUEST",
        issuedMessage:
          "Your boarding pass has been issued.\nWe look forward to greeting you at the gate.",
        savedMessage:
          "Your boarding pass is already issued.\nWe look forward to greeting you at the gate.",
        editButton: "Edit my RSVP",
        absent: {
          label: "NEXT FLIGHT · OPEN TICKET",
          title: "We will keep\na seat for {name}",
          message:
            "We are sorry you cannot join us,\nbut thank you for your warm wishes.\nWe hope to see you on the next flight.",
          footer: "VALID ANYTIME · NO EXPIRY",
        },
        panel: {
          label: "BOARDING PASS ISSUED",
          issuedTitle: "Your boarding pass has been issued",
          savedTitle: "Your boarding pass is already issued",
          absentTitle: "We hope to see you on the next flight",
          message:
            "Tap the photo at the top of the invitation\nto see your boarding pass anytime.",
          viewButton: "Go to my boarding pass",
        },
      },
      form: {
        name: "Full Name",
        phone: "Phone",
        phonePlaceholder: "0400-000-000",
        email: "Email",
        emailOptional: "(Optional)",
        attendance: "Attendance",
        attending: "I will attend",
        notAttending: "I cannot attend",
        guestCount: "Number of Guests",
        guestCountHint:
          "Please include all guests attending (including infants) for seating purposes.\nMeals will be provided for guests aged 2 and over only.",
        hasChildren: "Will any children or babies be attending?",
        hasChildrenNo: "No",
        hasChildrenYes: "Yes",
        childrenAges: "please let us know their age(s):",
        childrenAgesPlaceholder: "e.g., 6 months, 2 years, 5 years",
        note: "Special Requests",
        notePlaceholder:
          "Please let us know about any food allergies or any messages you would like to share with us",
        submit: "Get My Boarding Pass",
        submitNotAttending: "I'll Catch the Next Flight ✈️",
        submitting: "Submitting...",
        success: "Your boarding pass request has been submitted.",
        error: "An error occurred while submitting. Please try again.",
      },
    },
    thankYou: {
      message:
        "This flight log will continue to grow,\nas time goes on.\nThank you for being part of our journey.",
    },
  },
};
