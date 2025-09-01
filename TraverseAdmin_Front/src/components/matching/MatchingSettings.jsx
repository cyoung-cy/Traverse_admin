import { useState, useEffect } from "react";
import { matchingAPI } from "../../utils/api";
import { toast } from "react-hot-toast";

const MatchingSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);

  // 설정 데이터 불러오기
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await matchingAPI.getMatchingSettings();
        console.log("[매칭 설정 API 응답]", response);
        if (response.success) {
          setSettings(response.data);
          setFormData(response.data);
        }
      } catch (error) {
        console.error("매칭 설정을 불러오는 중 오류가 발생했습니다:", error);
        toast.error("매칭 설정을 불러올 수 없습니다");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // 폼 입력값 변경 처리
  const handleWeightChange = (factor, value) => {
    setFormData({
      ...formData,
      weight_settings: {
        ...formData.weight_settings,
        [factor]: parseInt(value, 10),
      },
    });
  };

  const handleThresholdChange = (key, value) => {
    setFormData({
      ...formData,
      thresholds: {
        ...formData.thresholds,
        [key]: parseInt(value, 10),
      },
    });
  };

  const handleOtherSettingChange = (key, value) => {
    setFormData({
      ...formData,
      [key]: parseInt(value, 10),
    });
  };

  // 저장 처리
  const handleSave = async () => {
    try {
      setSaving(true);
      // 가중치 합이 100인지 검증
      const weightSum = Object.values(formData.weight_settings).reduce(
        (a, b) => a + b,
        0
      );
      if (weightSum !== 100) {
        toast.error("가중치의 합은 100이어야 합니다");
        return;
      }

      const response = await matchingAPI.updateMatchingSettings(formData);
      console.log("[매칭 설정 업데이트 API 응답]", response);
      if (response.success) {
        toast.success("매칭 설정이 저장되었습니다");
        setSettings(formData);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("매칭 설정을 저장하는 중 오류가 발생했습니다:", error);
      toast.error("매칭 설정을 저장할 수 없습니다");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(settings);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="p-6 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700">
        <div className="flex justify-center items-center h-40">
          <div className="text-xl text-gray-400">
            설정 정보를 불러오는 중...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">매칭 알고리즘 설정</h2>
        <div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-sm bg-blue-600 rounded-md hover:bg-blue-700"
            >
              설정 수정
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm bg-gray-600 rounded-md hover:bg-gray-700"
                disabled={saving}
              >
                취소
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm bg-green-600 rounded-md hover:bg-green-700"
                disabled={saving}
              >
                {saving ? "저장 중..." : "저장"}
              </button>
            </div>
          )}
        </div>
      </div>

      {settings && (
        <div className="space-y-6">
          {/* 가중치 설정 */}
          <div>
            <h3 className="mb-3 text-lg font-medium">가중치 설정</h3>
            <p className="mb-3 text-sm text-gray-400">
              각 요소별 가중치의 합은 100이어야 합니다.
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {Object.entries(settings.weight_settings).map(
                ([factor, weight]) => (
                  <div key={factor} className="flex flex-col">
                    <label className="mb-1 text-sm capitalize">
                      {factor === "location"
                        ? "위치"
                        : factor === "interests"
                        ? "관심사"
                        : factor === "age"
                        ? "연령"
                        : factor === "gender"
                        ? "성별"
                        : factor === "activity_level"
                        ? "활동 수준"
                        : factor}
                    </label>
                    <div className="flex items-center">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={
                          isEditing ? formData.weight_settings[factor] : weight
                        }
                        onChange={(e) =>
                          handleWeightChange(factor, e.target.value)
                        }
                        disabled={!isEditing}
                        className="mr-2 w-full"
                      />
                      <span className="w-8 text-right">
                        {isEditing ? formData.weight_settings[factor] : weight}%
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* 임계값 설정 */}
          <div>
            <h3 className="mb-3 text-lg font-medium">임계값 설정</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm">최소 매칭 점수</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={
                      isEditing
                        ? formData.thresholds.minimum_score
                        : settings.thresholds.minimum_score
                    }
                    onChange={(e) =>
                      handleThresholdChange("minimum_score", e.target.value)
                    }
                    disabled={!isEditing}
                    className="px-3 py-2 w-full bg-gray-700 rounded-md border border-gray-600"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  이 점수 이상인 경우에만 매칭됩니다 (0-100)
                </p>
              </div>
              <div>
                <label className="block mb-1 text-sm">최대 거리 (km)</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={
                      isEditing
                        ? formData.thresholds.maximum_distance
                        : settings.thresholds.maximum_distance
                    }
                    onChange={(e) =>
                      handleThresholdChange("maximum_distance", e.target.value)
                    }
                    disabled={!isEditing}
                    className="px-3 py-2 w-full bg-gray-700 rounded-md border border-gray-600"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  이 거리 이내의 사용자만 매칭됩니다
                </p>
              </div>
            </div>
          </div>

          {/* 기타 설정 */}
          <div>
            <h3 className="mb-3 text-lg font-medium">기타 설정</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block mb-1 text-sm">
                  매칭 쿨다운 기간 (시간)
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="1"
                    max="72"
                    value={
                      isEditing
                        ? formData.cooldown_period
                        : settings.cooldown_period
                    }
                    onChange={(e) =>
                      handleOtherSettingChange(
                        "cooldown_period",
                        e.target.value
                      )
                    }
                    disabled={!isEditing}
                    className="px-3 py-2 w-full bg-gray-700 rounded-md border border-gray-600"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  이전 매칭 이후 다음 매칭까지 기다려야 하는 시간
                </p>
              </div>
              <div>
                <label className="block mb-1 text-sm">일일 최대 매칭 수</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={
                      isEditing
                        ? formData.matches_per_day
                        : settings.matches_per_day
                    }
                    onChange={(e) =>
                      handleOtherSettingChange(
                        "matches_per_day",
                        e.target.value
                      )
                    }
                    disabled={!isEditing}
                    className="px-3 py-2 w-full bg-gray-700 rounded-md border border-gray-600"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  사용자당 하루에 받을 수 있는 최대 매칭 수
                </p>
              </div>
            </div>
          </div>

          {/* 설정 정보 */}
          <div className="pt-6 mt-6 text-sm text-gray-400 border-t border-gray-700">
            <p>
              마지막 업데이트:{" "}
              {new Date(settings.last_updated).toLocaleString()}
            </p>
            <p>업데이트 관리자: {settings.updated_by}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchingSettings;
