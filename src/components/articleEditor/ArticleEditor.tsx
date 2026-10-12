import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Youtube from '@tiptap/extension-youtube'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import { adminUploadImage } from '../../api/client'
import './style.css'

type ArticleEditorProps = {
  value: string
  onChange: (html: string) => void
  disabled?: boolean
  /** Muda quando o conteúdo externo deve substituir o editor (ex.: carregar artigo). */
  contentKey?: string
}

type IconButtonProps = {
  label: string
  active?: boolean
  disabled?: boolean
  onClick: () => void
  children: ReactNode
}

function Icon({ d, children }: { d?: string; children?: ReactNode }) {
  return (
    <svg
      className="article-editor-svg"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {d ? <path d={d} /> : children}
    </svg>
  )
}

function IconButton({
  label,
  active,
  disabled,
  onClick,
  children,
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={`article-editor-icon-btn${active ? ' is-active' : ''}`}
      title={label}
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

function ArticleEditor({
  value,
  onChange,
  disabled,
  contentKey = 'default',
}: ArticleEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadingRef = useRef(false)
  const onChangeRef = useRef(onChange)
  const valueRef = useRef(value)
  const appliedContentKeyRef = useRef<string | null>(null)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    valueRef.current = value
  }, [value])

  const extensions = useMemo(
    () => [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Underline,
      Highlight.configure({ multicolor: false }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      Image.configure({
        HTMLAttributes: { class: 'article-editor-image' },
      }),
      Youtube.configure({
        width: 640,
        height: 360,
        HTMLAttributes: { class: 'article-editor-video' },
      }),
      Placeholder.configure({
        placeholder:
          'Escreva o artigo… Formate o texto, alinhe parágrafos e insira imagem ou vídeo.',
      }),
    ],
    [],
  )

  const editor = useEditor({
    extensions,
    // Conteúdo inicial fixo — nunca passar `value` aqui (isso desfaz formatação ao clicar).
    content: '<p></p>',
    editable: !disabled,
    shouldRerenderOnTransaction: true,
    onUpdate: ({ editor: current }) => {
      onChangeRef.current(current.getHTML())
    },
  })

  useEffect(() => {
    if (!editor) return
    editor.setEditable(!disabled)
  }, [editor, disabled])

  // Só carrega HTML externo ao abrir/trocar de artigo.
  useEffect(() => {
    if (!editor) return
    if (appliedContentKeyRef.current === contentKey) return
    appliedContentKeyRef.current = contentKey
    editor.commands.setContent(valueRef.current || '<p></p>', {
      emitUpdate: false,
    })
  }, [editor, contentKey])

  if (!editor) return null

  const blockValue = editor.isActive('heading', { level: 2 })
    ? 'h2'
    : editor.isActive('heading', { level: 3 })
      ? 'h3'
      : 'p'

  const alignValue = editor.isActive({ textAlign: 'center' })
    ? 'center'
    : editor.isActive({ textAlign: 'right' })
      ? 'right'
      : editor.isActive({ textAlign: 'justify' })
        ? 'justify'
        : 'left'

  const setLink = () => {
    const previous = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('URL do link', previous || 'https://')
    if (url === null) return
    if (url.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url.trim() })
      .run()
  }

  const insertVideo = () => {
    const url = window.prompt(
      'Cole o link do YouTube ou Vimeo',
      'https://www.youtube.com/watch?v=',
    )
    if (!url?.trim()) return
    editor.commands.setYoutubeVideo({ src: url.trim() })
  }

  const onPickImage = async (file: File | undefined) => {
    if (!file || uploadingRef.current) return
    uploadingRef.current = true
    try {
      const url = await adminUploadImage(file)
      editor.chain().focus().setImage({ src: url, alt: file.name }).run()
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'Falha no upload')
    } finally {
      uploadingRef.current = false
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const onBlockChange = (next: string) => {
    const chain = editor.chain().focus()
    if (next === 'h2') {
      chain.setHeading({ level: 2 }).run()
      return
    }
    if (next === 'h3') {
      chain.setHeading({ level: 3 }).run()
      return
    }
    chain.setParagraph().run()
  }

  return (
    <div className={`article-editor${disabled ? ' is-disabled' : ''}`}>
      <div className="article-editor-toolbar" role="toolbar" aria-label="Formatação">
        <div className="article-editor-group" role="group" aria-label="Histórico">
          <IconButton
            label="Desfazer"
            disabled={disabled || !editor.can().undo()}
            onClick={() => editor.chain().focus().undo().run()}
          >
            <Icon>
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.5 15a9 9 0 1 0 2.1-9.4L1 10" />
            </Icon>
          </IconButton>
          <IconButton
            label="Refazer"
            disabled={disabled || !editor.can().redo()}
            onClick={() => editor.chain().focus().redo().run()}
          >
            <Icon>
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.5 15a9 9 0 1 1-2.1-9.4L23 10" />
            </Icon>
          </IconButton>
        </div>

        <div className="article-editor-group" role="group" aria-label="Estilo do texto">
          <label className="article-editor-select-wrap">
            <span className="visually-hidden">Estilo do bloco</span>
            <select
              className="article-editor-select"
              value={blockValue}
              disabled={disabled}
              onChange={(event) => onBlockChange(event.target.value)}
              title="Estilo do parágrafo"
            >
              <option value="p">Parágrafo</option>
              <option value="h2">Título</option>
              <option value="h3">Subtítulo</option>
            </select>
          </label>
          <IconButton
            label="Negrito"
            active={editor.isActive('bold')}
            disabled={disabled}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <span className="article-editor-letter">
              <strong>B</strong>
            </span>
          </IconButton>
          <IconButton
            label="Itálico"
            active={editor.isActive('italic')}
            disabled={disabled}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <span className="article-editor-letter">
              <em>I</em>
            </span>
          </IconButton>
          <IconButton
            label="Sublinhado"
            active={editor.isActive('underline')}
            disabled={disabled}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <span className="article-editor-letter article-editor-mark-u">U</span>
          </IconButton>
          <IconButton
            label="Riscado"
            active={editor.isActive('strike')}
            disabled={disabled}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <span className="article-editor-letter article-editor-mark-s">S</span>
          </IconButton>
          <IconButton
            label="Destaque"
            active={editor.isActive('highlight')}
            disabled={disabled}
            onClick={() => editor.chain().focus().toggleHighlight().run()}
          >
            <span className="article-editor-letter article-editor-mark-hl">A</span>
          </IconButton>
          <IconButton
            label="Código"
            active={editor.isActive('code')}
            disabled={disabled}
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <Icon>
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </Icon>
          </IconButton>
        </div>

        <div className="article-editor-group" role="group" aria-label="Blocos e listas">
          <IconButton
            label="Citação"
            active={editor.isActive('blockquote')}
            disabled={disabled}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Icon>
              <path d="M3 21h6l2-8H7V5H3v8h4z" />
              <path d="M13 21h6l2-8h-4V5h-4v8h4z" />
            </Icon>
          </IconButton>
          <IconButton
            label="Lista"
            active={editor.isActive('bulletList')}
            disabled={disabled}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <Icon>
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <circle cx="4" cy="6" r="1" fill="currentColor" stroke="none" />
              <circle cx="4" cy="12" r="1" fill="currentColor" stroke="none" />
              <circle cx="4" cy="18" r="1" fill="currentColor" stroke="none" />
            </Icon>
          </IconButton>
          <IconButton
            label="Lista numerada"
            active={editor.isActive('orderedList')}
            disabled={disabled}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <Icon>
              <line x1="10" y1="6" x2="21" y2="6" />
              <line x1="10" y1="12" x2="21" y2="12" />
              <line x1="10" y1="18" x2="21" y2="18" />
              <text x="3" y="8" fontSize="7" fill="currentColor" stroke="none">
                1
              </text>
              <text x="3" y="14" fontSize="7" fill="currentColor" stroke="none">
                2
              </text>
              <text x="3" y="20" fontSize="7" fill="currentColor" stroke="none">
                3
              </text>
            </Icon>
          </IconButton>
          <IconButton
            label="Bloco de código"
            active={editor.isActive('codeBlock')}
            disabled={disabled}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            <Icon>
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <polyline points="8 10 11 12 8 14" />
              <line x1="13" y1="14" x2="16" y2="14" />
            </Icon>
          </IconButton>
          <IconButton
            label="Linha horizontal"
            disabled={disabled}
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <Icon>
              <line x1="4" y1="12" x2="20" y2="12" />
            </Icon>
          </IconButton>
          <label className="article-editor-select-wrap">
            <span className="visually-hidden">Alinhamento</span>
            <select
              className="article-editor-select"
              value={alignValue}
              disabled={disabled}
              title="Alinhamento"
              onChange={(event) =>
                editor
                  .chain()
                  .focus()
                  .setTextAlign(event.target.value)
                  .run()
              }
            >
              <option value="left">Esquerda</option>
              <option value="center">Centro</option>
              <option value="right">Direita</option>
              <option value="justify">Justificar</option>
            </select>
          </label>
        </div>

        <div className="article-editor-group" role="group" aria-label="Mídia e limpar">
          <IconButton
            label="Link"
            active={editor.isActive('link')}
            disabled={disabled}
            onClick={setLink}
          >
            <Icon>
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </Icon>
          </IconButton>
          <IconButton
            label="Imagem"
            disabled={disabled}
            onClick={() => fileInputRef.current?.click()}
          >
            <Icon>
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <circle cx="8.5" cy="10" r="1.5" fill="currentColor" stroke="none" />
              <polyline points="21 15 16 10 5 19" />
            </Icon>
          </IconButton>
          <IconButton label="Vídeo" disabled={disabled} onClick={insertVideo}>
            <Icon>
              <rect x="3" y="6" width="14" height="12" rx="2" />
              <polygon points="17 10 22 7 22 17 17 14" fill="currentColor" />
            </Icon>
          </IconButton>
          <IconButton
            label="Limpar formatação"
            disabled={disabled}
            onClick={() =>
              editor.chain().focus().unsetAllMarks().clearNodes().run()
            }
          >
            <Icon>
              <path d="M4 7h16" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12" />
              <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
            </Icon>
          </IconButton>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        hidden
        onChange={(event) => void onPickImage(event.target.files?.[0])}
      />
      <EditorContent editor={editor} className="article-editor-content" />
    </div>
  )
}

export default ArticleEditor
