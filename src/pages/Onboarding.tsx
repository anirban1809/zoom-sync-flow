import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingWizard from "@/components/OnboardingWizard";

const Onboarding = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) {
      navigate("/");
    }
  }, [open, navigate]);

  return <OnboardingWizard open={open} onOpenChange={setOpen} />;
};

export default Onboarding;
