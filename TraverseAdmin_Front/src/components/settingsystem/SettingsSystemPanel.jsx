import React, { useEffect, useState } from "react";
import { settingsAPI } from "../../utils/api";

// Card와 Row를 함수 바깥에 선언
const Card = ({ title, children }) => (
  <div className="p-4 bg-white rounded-xl border border-gray-200 shadow dark:bg-gray-800 dark:border-gray-900">
    <h2 className="mb-4 text-lg font-bold text-gray-800 dark:text-gray-100">
      {title}
    </h2>
    <div className="divide-y divide-gray-200 dark:divide-gray-800">
      {children}
    </div>
  </div>
);

const Row = ({ label, children, isLast }) => (
  <div
    className={`flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:gap-0`}
  >
    <div className="pr-6 w-40 font-medium text-gray-700 dark:text-gray-200 shrink-0 sm:border-r sm:border-gray-200 dark:sm:border-gray-700">
      {label}
    </div>
    <div className="flex-1 mt-2 sm:pl-6 sm:mt-0">{children}</div>
  </div>
);

const SettingsSystemPanel = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await settingsAPI.getSystemSettings();
      setSettings(res.data);
      setForm(JSON.parse(JSON.stringify(res.data)));
    } catch (err) {
      setError("설정 정보를 불러오지 못했습니다.");
    }
    setLoading(false);
  };

  const handleChange = (section, key, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const handleNestedChange = (section, subKey, key, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subKey]: {
          ...prev[section][subKey],
          [key]: value,
        },
      },
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      await settingsAPI.updateSystemSettings(form);
      setEditMode(false);
      fetchSettings();
    } catch (err) {
      setError("설정 저장에 실패했습니다.");
    }
    setLoading(false);
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!settings) return null;

  return (
    <div className="py-6 mx-auto max-w-6xl min-h-0 bg-gray-900">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* 일반 설정 */}
        <Card title="일반 설정">
          <Row label="사이트 이름">
            {editMode ? (
              <input
                className="px-2 py-1 w-full text-black rounded border"
                value={form.general?.site_name || ""}
                onChange={(e) =>
                  handleChange("general", "site_name", e.target.value)
                }
              />
            ) : (
              <span>{settings.general?.site_name}</span>
            )}
          </Row>
          <Row label="사이트 설명">
            {editMode ? (
              <input
                className="px-2 py-1 w-full text-black rounded border"
                value={form.general?.site_description || ""}
                onChange={(e) =>
                  handleChange("general", "site_description", e.target.value)
                }
              />
            ) : (
              <span>{settings.general?.site_description}</span>
            )}
          </Row>
          <Row label="대표 이메일">
            {editMode ? (
              <input
                className="px-2 py-1 w-full text-black rounded border"
                value={form.general?.contact_email || ""}
                onChange={(e) =>
                  handleChange("general", "contact_email", e.target.value)
                }
              />
            ) : (
              <span>{settings.general?.contact_email}</span>
            )}
          </Row>
          <Row label="고객지원 이메일" isLast>
            {editMode ? (
              <input
                className="px-2 py-1 w-full text-black rounded border"
                value={form.general?.support_email || ""}
                onChange={(e) =>
                  handleChange("general", "support_email", e.target.value)
                }
              />
            ) : (
              <span>{settings.general?.support_email}</span>
            )}
          </Row>
        </Card>

        {/* 보안 설정 */}
        <Card title="보안 설정">
          <Row label="로그인 시도 제한">
            {editMode ? (
              <input
                type="number"
                className="px-2 py-1 w-full text-black rounded border"
                value={form.security?.login_attempts || ""}
                onChange={(e) =>
                  handleChange(
                    "security",
                    "login_attempts",
                    Number(e.target.value)
                  )
                }
              />
            ) : (
              <span>{settings.security?.login_attempts}</span>
            )}
          </Row>
          <Row label="계정 잠금 시간(분)">
            {editMode ? (
              <input
                type="number"
                className="px-2 py-1 w-full text-black rounded border"
                value={form.security?.lockout_duration || ""}
                onChange={(e) =>
                  handleChange(
                    "security",
                    "lockout_duration",
                    Number(e.target.value)
                  )
                }
              />
            ) : (
              <span>{settings.security?.lockout_duration}</span>
            )}
          </Row>
          <div className="pt-3">
            <div className="mb-2 font-medium text-gray-700 dark:text-gray-200">
              비밀번호 정책
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Row label="최소 길이">
                {editMode ? (
                  <input
                    type="number"
                    className="px-2 py-1 w-full text-black rounded border"
                    value={form.security?.password_policy?.min_length || ""}
                    onChange={(e) =>
                      handleNestedChange(
                        "security",
                        "password_policy",
                        "min_length",
                        Number(e.target.value)
                      )
                    }
                  />
                ) : (
                  <span>{settings.security?.password_policy?.min_length}</span>
                )}
              </Row>
              <Row label="대문자 포함">
                <input
                  type="checkbox"
                  disabled={!editMode}
                  checked={
                    form.security?.password_policy?.require_uppercase || false
                  }
                  onChange={(e) =>
                    handleNestedChange(
                      "security",
                      "password_policy",
                      "require_uppercase",
                      e.target.checked
                    )
                  }
                  className={`w-5 h-5 bg-white rounded-md border-2 border-transparent ring-0 accent-blue-500
                    ${
                      !editMode
                        ? form.security?.password_policy?.require_uppercase
                          ? "outline outline-2 outline-green-500 outline-offset-0"
                          : "outline outline-2 outline-red-500 outline-offset-0"
                        : "outline-none border-gray-300"
                    }
                  `}
                />
              </Row>
              <Row label="소문자 포함">
                <input
                  type="checkbox"
                  disabled={!editMode}
                  checked={
                    form.security?.password_policy?.require_lowercase || false
                  }
                  onChange={(e) =>
                    handleNestedChange(
                      "security",
                      "password_policy",
                      "require_lowercase",
                      e.target.checked
                    )
                  }
                  className={`w-5 h-5 bg-white rounded-md border-2 border-transparent ring-0 accent-blue-500
                    ${
                      !editMode
                        ? form.security?.password_policy?.require_lowercase
                          ? "outline outline-2 outline-green-500 outline-offset-0"
                          : "outline outline-2 outline-red-500 outline-offset-0"
                        : "outline-none border-gray-300"
                    }
                  `}
                />
              </Row>
              <Row label="숫자 포함">
                <input
                  type="checkbox"
                  disabled={!editMode}
                  checked={
                    form.security?.password_policy?.require_numbers || false
                  }
                  onChange={(e) =>
                    handleNestedChange(
                      "security",
                      "password_policy",
                      "require_numbers",
                      e.target.checked
                    )
                  }
                  className={`w-5 h-5 bg-white rounded-md border-2 border-transparent ring-0 accent-blue-500
                    ${
                      !editMode
                        ? form.security?.password_policy?.require_numbers
                          ? "outline outline-2 outline-green-500 outline-offset-0"
                          : "outline outline-2 outline-red-500 outline-offset-0"
                        : "outline-none border-gray-300"
                    }
                  `}
                />
              </Row>
              <Row label="특수문자 포함" isLast>
                <input
                  type="checkbox"
                  disabled={!editMode}
                  checked={
                    form.security?.password_policy?.require_special_chars ||
                    false
                  }
                  onChange={(e) =>
                    handleNestedChange(
                      "security",
                      "password_policy",
                      "require_special_chars",
                      e.target.checked
                    )
                  }
                  className={`w-5 h-5 bg-white rounded-md border-2 border-transparent ring-0 accent-blue-500
                    ${
                      !editMode
                        ? form.security?.password_policy?.require_special_chars
                          ? "outline outline-2 outline-green-500 outline-offset-0"
                          : "outline outline-2 outline-red-500 outline-offset-0"
                        : "outline-none border-gray-300"
                    }
                  `}
                />
              </Row>
            </div>
          </div>
        </Card>

        {/* 콘텐츠 설정 */}
        <Card title="콘텐츠 설정">
          <Row label="게시글 최대 길이">
            {editMode ? (
              <input
                type="number"
                className="px-2 py-1 w-full text-black rounded border"
                value={form.content?.max_post_length || ""}
                onChange={(e) =>
                  handleChange(
                    "content",
                    "max_post_length",
                    Number(e.target.value)
                  )
                }
              />
            ) : (
              <span>{settings.content?.max_post_length}</span>
            )}
          </Row>
          <Row label="댓글 최대 길이">
            {editMode ? (
              <input
                type="number"
                className="px-2 py-1 w-full text-black rounded border"
                value={form.content?.max_comment_length || ""}
                onChange={(e) =>
                  handleChange(
                    "content",
                    "max_comment_length",
                    Number(e.target.value)
                  )
                }
              />
            ) : (
              <span>{settings.content?.max_comment_length}</span>
            )}
          </Row>
          <Row label="자동 검토 트리거(쉼표로 구분)">
            {editMode ? (
              <input
                className="px-2 py-1 w-full text-black rounded border"
                value={form.content?.auto_review_triggers?.join(",") || ""}
                onChange={(e) =>
                  handleChange(
                    "content",
                    "auto_review_triggers",
                    e.target.value.split(",")
                  )
                }
              />
            ) : (
              <span>{settings.content?.auto_review_triggers?.join(", ")}</span>
            )}
          </Row>
          <Row label="금지어(쉼표로 구분)" isLast>
            {editMode ? (
              <input
                className="px-2 py-1 w-full text-black rounded border"
                value={form.content?.banned_words?.join(",") || ""}
                onChange={(e) =>
                  handleChange(
                    "content",
                    "banned_words",
                    e.target.value.split(",")
                  )
                }
              />
            ) : (
              <span>{settings.content?.banned_words?.join(", ")}</span>
            )}
          </Row>
        </Card>

        {/* 알림 설정 */}
        <Card title="알림 설정">
          <Row label="이메일 알림 사용">
            <input
              type="checkbox"
              disabled={!editMode}
              checked={form.notification?.email_notifications || false}
              onChange={(e) =>
                handleChange(
                  "notification",
                  "email_notifications",
                  e.target.checked
                )
              }
              className={`w-5 h-5 bg-white rounded-md border-2 border-transparent ring-0 accent-blue-500
                ${
                  !editMode
                    ? form.notification?.email_notifications
                      ? "outline outline-2 outline-green-500 outline-offset-0"
                      : "outline outline-2 outline-red-500 outline-offset-0"
                    : "outline-none border-gray-300"
                }
              `}
            />
          </Row>
          <Row label="푸시 알림 사용">
            <input
              type="checkbox"
              disabled={!editMode}
              checked={form.notification?.push_notifications || false}
              onChange={(e) =>
                handleChange(
                  "notification",
                  "push_notifications",
                  e.target.checked
                )
              }
              className={`w-5 h-5 bg-white rounded-md border-2 border-transparent ring-0 accent-blue-500
                ${
                  !editMode
                    ? form.notification?.push_notifications
                      ? "outline outline-2 outline-green-500 outline-offset-0"
                      : "outline outline-2 outline-red-500 outline-offset-0"
                    : "outline-none border-gray-300"
                }
              `}
            />
          </Row>
          <Row label="알림 요약 빈도" isLast>
            {editMode ? (
              <input
                className="px-2 py-1 w-full text-black rounded border"
                value={form.notification?.digest_frequency || ""}
                onChange={(e) =>
                  handleChange(
                    "notification",
                    "digest_frequency",
                    e.target.value
                  )
                }
              />
            ) : (
              <span>{settings.notification?.digest_frequency}</span>
            )}
          </Row>
        </Card>
      </div>
      {/* 버튼 영역 */}
      <div className="flex gap-2 justify-center mt-4">
        {editMode ? (
          <>
            <button
              className="px-4 py-2 text-white bg-green-500 rounded shadow"
              onClick={handleSave}
            >
              저장
            </button>
            <button
              className="px-4 py-2 bg-gray-300 rounded shadow"
              onClick={() => {
                setEditMode(false);
                setForm(JSON.parse(JSON.stringify(settings)));
              }}
            >
              취소
            </button>
          </>
        ) : (
          <button
            className="px-4 py-2 text-white bg-blue-500 rounded shadow"
            onClick={() => setEditMode(true)}
          >
            수정
          </button>
        )}
      </div>
    </div>
  );
};

export default SettingsSystemPanel;
