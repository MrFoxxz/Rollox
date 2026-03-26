import { useTranslation } from 'react-i18next'
import { GitBranch, Send } from 'lucide-react'

const Footer = () => {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-slate-900 bg-slate-950/50 backdrop-blur-sm py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-slate-500 text-sm">
        <div className="flex items-center space-x-2 mb-6 md:mb-0">
          <span className="font-bold text-slate-300 italic tracking-tighter uppercase mr-2 text-lg">Rollox</span>
          <span>© {year} {t('common.app_name')}. {t('footer.rights')}</span>
        </div>

        <div className="flex flex-col items-center md:items-end space-y-4">
          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-primary-500 transition-colors flex items-center gap-2">
              <GitBranch size={18} />
              <span>{t('footer.github')}</span>
            </a>
            <a href="#" className="hover:text-primary-500 transition-colors flex items-center gap-2">
              <Send size={18} />
              <span>{t('footer.twitter')}</span>
            </a>
          </div>
          <p className="text-xs max-w-xs text-center md:text-right text-slate-600">
            {t('footer.tagline')}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
