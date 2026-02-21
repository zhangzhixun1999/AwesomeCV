"""模板相关 API"""
from fastapi import APIRouter, HTTPException
from app.schemas.user import APIResponse

router = APIRouter()

# 模板默认内容
MODERN_CONTENT = {
    "personalInfo": {
        "name": "林徐坤",
        "title": "算法工程师",
        "email": "linxukun@example.com",
        "phone": "+86 138-0000-0000",
        "location": "杭州市",
    },
    "summary": "阿里巴巴P7算法工程师，专注于大模型研究和应用。擅长深度学习、自然语言处理和推荐系统，具有丰富的工业界实践经验。热衷于探索AI前沿技术，将研究成果转化为实际生产力。",
    "workExperience": [
        {
            "id": "1",
            "company": "阿里巴巴",
            "position": "算法工程师（P7）",
            "startDate": "2022-03",
            "endDate": "",
            "current": True,
            "description": "负责大模型的研究和应用落地，深入研究模型架构细节。带领团队优化模型性能，在多个业务场景中实现显著效果提升。专注于Transformer架构、模型压缩和推理优化。"
        },
        {
            "id": "2",
            "company": "百度",
            "position": "算法工程师",
            "startDate": "2020-01",
            "endDate": "2022-02",
            "current": False,
            "description": "负责PDC（Parallel Distributed Computing）流式计算系统的研发工作。参与大规模分布式计算框架的优化，提升系统吞吐量和稳定性。"
        }
    ],
    "education": [
        {
            "id": "1",
            "school": "浙江大学",
            "degree": "硕士",
            "major": "计算机科学与技术",
            "startDate": "2017-09",
            "endDate": "2020-06"
        },
        {
            "id": "2",
            "school": "浙江大学",
            "degree": "学士",
            "major": "软件工程",
            "startDate": "2013-09",
            "endDate": "2017-06"
        }
    ],
    "skills": ["Python", "PyTorch", "TensorFlow", "深度学习", "自然语言处理", "推荐系统", "Transformer", "大模型", "分布式训练", "CUDA优化"],
    "projects": [
        {
            "id": "1",
            "name": "大规模语言模型优化平台",
            "description": "设计并开发支持千亿参数规模的大模型训练和推理平台，实现模型压缩、量化和推理加速",
            "technologies": ["PyTorch", "CUDA", "分布式训练", "模型量化"],
            "startDate": "2023-01",
            "endDate": "2023-12"
        }
    ]
}

CLASSIC_CONTENT = {
    "personalInfo": {
        "name": "林徐坤",
        "title": "资深算法专家",
        "email": "linxukun@example.com",
        "phone": "+86 138-0000-0000",
        "location": "杭州市",
    },
    "summary": "阿里巴巴P7算法专家，8年AI研发经验。专注于大模型、推荐系统和自然语言处理领域，拥有丰富的工业界落地经验。擅长将前沿学术研究转化为实际生产力。",
    "workExperience": [
        {
            "id": "1",
            "company": "阿里巴巴",
            "position": "算法专家（P7）",
            "startDate": "2020-06",
            "endDate": "",
            "current": True,
            "description": "负责大模型研究与应用落地，深入研究Transformer架构和模型优化细节。带领团队在搜索、推荐等核心业务场景实现算法突破，业务指标提升显著。"
        },
        {
            "id": "2",
            "company": "百度",
            "position": "高级算法工程师",
            "startDate": "2018-03",
            "endDate": "2020-05",
            "current": False,
            "description": "负责PDC流式计算系统的算法研发，参与大规模分布式机器学习框架的优化工作。提升系统吞吐量和训练效率。"
        }
    ],
    "education": [
        {
            "id": "1",
            "school": "浙江大学",
            "degree": "博士",
            "major": "计算机科学与技术",
            "startDate": "2015-09",
            "endDate": "2018-06"
        },
        {
            "id": "2",
            "school": "浙江大学",
            "degree": "学士",
            "major": "软件工程",
            "startDate": "2011-09",
            "endDate": "2015-06"
        }
    ],
    "skills": ["深度学习", "PyTorch", "TensorFlow", "自然语言处理", "推荐系统", "Transformer", "强化学习", "分布式训练", "CUDA优化", "大模型"],
    "projects": [
        {
            "id": "1",
            "name": "千亿级大模型训练平台",
            "description": "从0到1设计并实现支持千亿参数规模的大模型训练平台，实现模型并行、数据并行和流水线并行的优化",
            "technologies": ["PyTorch", "分布式训练", "模型并行", "CUDA"],
            "startDate": "2022-01",
            "endDate": "2023-12"
        }
    ]
}

CREATIVE_CONTENT = {
    "personalInfo": {
        "name": "林徐坤",
        "title": "AI算法架构师",
        "email": "linxukun@example.com",
        "phone": "+86 137-0000-0000",
        "location": "杭州市",
        "linkedin": "linkedin.com/in/linxukun",
        "website": "linxukun.ai",
    },
    "summary": "充满激情的AI研究者，专注于探索大模型的边界和可能性。相信人工智能能够改变世界，致力于将最前沿的算法技术应用到实际产品中，创造用户价值。",
    "workExperience": [
        {
            "id": "1",
            "company": "阿里巴巴达摩院",
            "position": "算法架构师（P7）",
            "startDate": "2021-08",
            "endDate": "",
            "current": True,
            "description": "负责大规模预训练模型的研发与落地，从模型架构设计到工程实现的全流程参与。研发的模型在多项国际基准测试中获得SOTA结果，应用于阿里巴巴核心业务线。"
        },
        {
            "id": "2",
            "company": "百度IDL",
            "position": "高级算法研究员",
            "startDate": "2019-06",
            "endDate": "2021-07",
            "current": False,
            "description": "参与PDC深度学习平台的研发，建立分布式训练框架和模型优化pipeline。提升模型训练效率3倍以上。"
        }
    ],
    "education": [
        {
            "id": "1",
            "school": "浙江大学",
            "degree": "博士",
            "major": "计算机科学与技术",
            "startDate": "2015-09",
            "endDate": "2019-06"
        }
    ],
    "skills": ["PyTorch", "TensorFlow", "深度学习", "Transformer", "BERT", "GPT", "强化学习", "知识图谱", "MLOps", "模型部署"],
    "projects": [
        {
            "id": "1",
            "name": "多模态大模型研发",
            "description": "从0到1研发图文多模态大模型，实现视觉-语言跨模态理解和生成，在多个下游任务中达到SOTA效果",
            "technologies": ["PyTorch", "Transformer", "多模态学习", "分布式训练"],
            "startDate": "2023-01",
            "endDate": "2024-01"
        }
    ]
}

# 硬编码的模板数据
TEMPLATES = [
    {
        "id": "modern",
        "name": "现代风格",
        "description": "简洁现代的设计风格，适合科技、互联网行业",
        "preview": "/templates/modern.png",
        "category": "modern",
        "features": ["简洁设计", "强调技能", "现代排版"],
        "defaultContent": MODERN_CONTENT,
    },
    {
        "id": "classic",
        "name": "经典风格",
        "description": "传统专业的设计风格，适合金融、教育、传统行业",
        "preview": "/templates/classic.png",
        "category": "classic",
        "features": ["专业排版", "传统布局", "稳重设计"],
        "defaultContent": CLASSIC_CONTENT,
    },
    {
        "id": "creative",
        "name": "创意风格",
        "description": "富有创意的设计风格，适合设计、艺术、创意行业",
        "preview": "/templates/creative.png",
        "category": "creative",
        "features": ["创意布局", "视觉突出", "个性展示"],
        "defaultContent": CREATIVE_CONTENT,
    },
]


@router.get("")
def get_templates():
    """获取所有模板"""
    return APIResponse(
        success=True,
        data=TEMPLATES
    )


@router.get("/{template_id}")
def get_template(template_id: str):
    """获取单个模板详情"""
    template = next((t for t in TEMPLATES if t["id"] == template_id), None)

    if not template:
        raise HTTPException(
            status_code=404,
            detail="模板不存在"
        )

    return APIResponse(
        success=True,
        data=template
    )
